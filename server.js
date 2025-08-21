require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Add cookie-parser middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecomom', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Import Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes');
const Project = require('./models/Project');
const BlogPost = require('./models/BlogPost');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/admin', adminRoutes);

// Home route - render home page with projects
app.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).limit(3);
    const featuredProject = await Project.findOne({ featured: true }).sort({ createdAt: -1 });
    res.render('home', { projects, featuredProject });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.render('home', { projects: [], featuredProject: null });
  }
});

// Disable CMS login temporarily
app.get('/admin/login', (req, res) => {
  res.redirect('/');
});

// Add routes for created pages
app.get('/all-projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.render('all-projects', { projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.render('all-projects', { projects: [] });
    }
});

app.get('/single-property/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).send('Project not found');
    }
    res.render('single-property', { property: project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).send('Server error');
  }
});

app.get('/about', (req, res) => {
    res.render('about-us');
});

app.get('/blog', async (req, res) => {
    try {
      const blogs = await BlogPost.find({}).sort({ createdAt: -1 }).limit(12);
      res.render('blog', { blogs });
    } catch (e) {
      console.error('Error fetching blogs:', e);
      res.render('blog', { blogs: [] });
    }
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body || {};
  console.log('Contact Inquiry:', { name, email, phone, message, at: new Date().toISOString() });
  return res.status(200).json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});