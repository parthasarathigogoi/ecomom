const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const multer = require('multer');
const path = require('path');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/blogs/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all blog posts (public)
router.get('/', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.json(blogPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single blog post by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) return res.status(404).json({ message: 'Blog post not found' });
    res.json(blogPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new blog post (admin only)
router.post('/', upload.single('coverImage'), async (req, res) => {
  const blogPost = new BlogPost({
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    fullContent: req.body.fullContent,
    date: req.body.date
  });

  if (req.file) {
    blogPost.coverImage = '/uploads/blogs/' + req.file.filename;
  }

  try {
    const newBlogPost = await blogPost.save();
    res.status(201).json(newBlogPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update blog post (admin only)
router.patch('/:id', upload.single('coverImage'), async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) return res.status(404).json({ message: 'Blog post not found' });

    // Update fields
    Object.keys(req.body).forEach(key => {
      blogPost[key] = req.body[key];
    });

    if (req.file) {
      blogPost.coverImage = '/uploads/blogs/' + req.file.filename;
    }

    const updatedBlogPost = await blogPost.save();
    res.json(updatedBlogPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete blog post (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) return res.status(404).json({ message: 'Blog post not found' });

    await BlogPost.deleteOne({ _id: req.params.id });
    res.json({ message: 'Blog post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;