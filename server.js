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

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(require('express-ejs-layouts'));
app.set('layout', false); // Default to no layout unless specified

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecomom', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// JWT middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const blogRoutes = require('./routes/blogRoutes');
const pageRoutes = require('./routes/pageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const userRoutes = require('./routes/userRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const Project = require('./models/Project');
const BlogPost = require('./models/BlogPost');

// API Routes
app.use('/api/auth', authRoutes);

// Protected project routes
app.use('/api/projects', (req, res, next) => {
  if (req.method === 'GET') {
    next();
  } else {
    authenticateToken(req, res, next);
  }
}, projectRoutes);

app.use('/api/blogs', blogRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
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

// Home route alias
app.get('/home', async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).limit(3);
    const featuredProject = await Project.findOne({ featured: true }).sort({ createdAt: -1 });
    res.render('home', { projects, featuredProject });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.render('home', { projects: [], featuredProject: null });
  }
});

// All Projects page (matching navigation links)
app.get('/all-projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.render('all-projects', { projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.render('all-projects', { projects: [] });
  }
});

// Projects page alias
app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.render('all-projects', { projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.render('all-projects', { projects: [] });
  }
});

// Single property page
app.get('/single-property/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).render('404');
        }
        res.render('single-property', { property: project });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).render('500');
    }
});

// About Us page (matching navigation links)
app.get('/about-us', async (req, res) => {
  try {
    res.render('about-us');
  } catch (error) {
    console.error('Error rendering about page:', error);
    res.status(500).render('500');
  }
});

// About page alias
app.get('/about', async (req, res) => {
  try {
    res.render('about-us');
  } catch (error) {
    console.error('Error rendering about page:', error);
    res.status(500).render('500');
  }
});

// Blog page
app.get('/blog', async (req, res) => {
  try {
    const blogs = await BlogPost.find().sort({ createdAt: -1 });
    const blogPosts = blogs || [];
    res.render('blog', { blogs, blogPosts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.render('blog', { blogs: [], blogPosts: [] });
  }
});

// Contact page
app.get('/contact', async (req, res) => {
  try {
    res.render('contact');
  } catch (error) {
    console.error('Error rendering contact page:', error);
    res.status(500).render('500');
  }
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.json({ success: true, message: 'Message sent successfully!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});