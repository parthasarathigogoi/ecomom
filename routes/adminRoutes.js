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
  res.render('admin/dashboard', { user: req.user });
});

// Projects Management Page
router.get('/projects', verifyAdmin, (req, res) => {
  res.render('admin/projects', { user: req.user });
});

// Add/Edit Project Page
router.get('/projects/edit/:id?', verifyAdmin, (req, res) => {
  res.render('admin/project_edit', { user: req.user, projectId: req.params.id });
});

// Blog Posts Management Page
router.get('/blogs', verifyAdmin, (req, res) => {
  res.render('admin/blogs', { user: req.user });
});

// Add/Edit Blog Post Page
router.get('/blogs/edit/:id?', verifyAdmin, (req, res) => {
  res.render('admin/blog_edit', { user: req.user, blogId: req.params.id });
});

// Admin Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/admin/login');
});

module.exports = router;