const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to verify JWT and check for admin role
const verifyAdmin = (req, res, next) => {
  const token = req.cookies.token; // Assuming token is sent via cookie
  if (!token) {
    return res.redirect('/admin/login'); // Redirect to login if no token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).send('Access Denied: Not an Admin');
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.redirect('/admin/login'); // Redirect to login if token is invalid
  }
};

// Admin Login Page
router.get('/login', (req, res) => {
  res.render('admin/login', { layout: false }); // Render login page without a common layout
});

// Admin Dashboard
router.get('/dashboard', verifyAdmin, (req, res) => {
  res.render('admin/dashboard', { 
    user: req.user,
    title: 'Admin Dashboard',
    layout: 'admin/layout'
  });
});

// Projects Management Page
router.get('/projects', verifyAdmin, (req, res) => {
  res.render('admin/projects', { 
    user: req.user,
    title: 'Manage Projects',
    layout: 'admin/layout'
  });
});

// Add/Edit Project Page
router.get('/projects/edit/:id?', verifyAdmin, (req, res) => {
  res.render('admin/project_edit', { 
    user: req.user, 
    projectId: req.params.id,
    title: req.params.id ? 'Edit Project' : 'Add New Project',
    layout: 'admin/layout'
  });
});

// Blog Posts Management Page
router.get('/blogs', verifyAdmin, (req, res) => {
  res.render('admin/blogs', { 
    user: req.user,
    title: 'Manage Blog Posts',
    layout: 'admin/layout'
  });
});

// Add/Edit Blog Post Page
router.get('/blogs/edit/:id?', verifyAdmin, (req, res) => {
  res.render('admin/blog_edit', { 
    user: req.user, 
    blogId: req.params.id,
    title: req.params.id ? 'Edit Blog Post' : 'Add New Blog Post',
    layout: 'admin/layout'
  });
});

// Media Management Page
router.get('/media', verifyAdmin, (req, res) => {
  res.render('admin/media', {
    user: req.user,
    title: 'Manage Media',
    layout: 'admin/layout'
  });
});

// Users Management Page
router.get('/users', verifyAdmin, (req, res) => {
  res.render('admin/users', {
    user: req.user,
    title: 'Manage Users',
    layout: 'admin/layout'
  });
});

// Settings Management Page
router.get('/settings', verifyAdmin, (req, res) => {
  res.render('admin/settings', {
    user: req.user,
    title: 'Settings',
    layout: 'admin/layout'
  });
});

// Page Management Routes
router.get('/pages/:name', verifyAdmin, async (req, res) => {
  const pageName = req.params.name;
  // Validate page name
  if (!['home', 'about', 'contact', 'projects', 'blog'].includes(pageName)) {
    return res.status(404).send('Page not found');
  }
  const pageTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  res.render('admin/page_edit', { 
    user: req.user, 
    pageName: pageName,
    title: `Edit ${pageTitle} Page`,
    layout: 'admin/layout'
  });
});

// Admin Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/admin/login');
});

module.exports = router;