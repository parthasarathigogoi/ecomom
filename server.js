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

// Setup EJS with layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(require('express-ejs-layouts'));
app.set('layout', false); // Default to no layout unless specified

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

// API routes
app.use('/api/auth', authRoutes);

// Apply authentication middleware to protected routes
app.use('/api/projects', (req, res, next) => {
  // Skip authentication for GET requests (public access)
  if (req.method === 'GET') {
    return next();
  }
  // Apply authentication for POST, PATCH, DELETE (admin only)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}, projectRoutes);

app.use('/api/blogs', blogRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/admin', adminRoutes);

// Home route - render home page with projects
app.get('/home', async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).limit(3);
    const Page = require('./models/Page');
    const homePage = await Page.findOne({ name: 'home' });
    res.render('home', { 
      projects,
      page: homePage || { 
        title: 'Welcome to EcoMom',
        content: {
          heroTitle: 'Sustainable Living Spaces',
          heroSubtitle: 'Eco-friendly homes for a better tomorrow'
        }
      }
    });
  } catch (error) {
    console.error('Error fetching home page data:', error);
    res.render('home', { projects: [], page: null });
  }
});

// Redirect root to admin login
app.get('/', (req, res) => {
  res.redirect('/admin/login');
});

// Add routes for created pages
app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    const Page = require('./models/Page');
    const projectsPage = await Page.findOne({ name: 'projects' });
    res.render('all-projects', { 
      projects,
      page: projectsPage || { 
        title: 'Our Projects - EcoMom',
        content: {
          mainHeading: 'Sustainable Living Projects',
          introText: '<p>Explore our portfolio of eco-friendly residential and commercial projects.</p>'
        }
      }
    });
  } catch (error) {
    console.error('Error fetching projects page data:', error);
    res.render('all-projects', { projects: [], page: null });
  }
});

app.get('/projects/:id', async (req, res) => {
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

app.get('/about', async (req, res) => {
  try {
    const Page = require('./models/Page');
    const aboutPage = await Page.findOne({ name: 'about' });
    res.render('about-us', { 
      page: aboutPage || { 
        title: 'About Us - EcoMom',
        content: {
          mainHeading: 'Our Story',
          mainContent: '<p>Founded in 2010, EcoMom has been at the forefront of sustainable real estate development.</p>'
        }
      }
    });
  } catch (error) {
    console.error('Error fetching about page data:', error);
    res.status(500).send('Server Error');
  }
});

app.get('/blog', async (req, res) => {
  try {
    const BlogPost = require('./models/BlogPost');
    const blogPosts = await BlogPost.find().sort({ date: -1 });
    const Page = require('./models/Page');
    const blogPage = await Page.findOne({ name: 'blog' });
    res.render('blog', { 
      blogPosts,
      page: blogPage || { 
        title: 'Blog - EcoMom',
        content: {
          mainHeading: 'Sustainable Living Insights',
          introText: '<p>Stay updated with the latest trends in sustainable living.</p>'
        }
      }
    });
  } catch (error) {
    console.error('Error fetching blog page data:', error);
    res.render('blog', { blogPosts: [], page: null });
  }
});

app.get('/contact', async (req, res) => {
  try {
    const Page = require('./models/Page');
    const contactPage = await Page.findOne({ name: 'contact' });
    res.render('contact', { 
      page: contactPage || { 
        title: 'Contact Us - EcoMom',
        content: {
          mainHeading: 'Get in Touch',
          introText: '<p>We\'d love to hear from you.</p>'
        }
      }
    });
  } catch (error) {
    console.error('Error fetching contact page data:', error);
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});