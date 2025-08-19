const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const { verifyAdmin } = require('../middleware/auth');

// Get all pages
router.get('/', async (req, res) => {
  try {
    const pages = await Page.find().select('name title lastUpdated');
    res.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific page by name
router.get('/:name', async (req, res) => {
  try {
    const page = await Page.findOne({ name: req.params.name });
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    console.error(`Error fetching page ${req.params.name}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update a page (admin only)
router.post('/:name', verifyAdmin, async (req, res) => {
  try {
    const { title, content, metaDescription } = req.body;
    const name = req.params.name;
    
    // Validate page name
    if (!['home', 'about', 'contact', 'projects', 'blog'].includes(name)) {
      return res.status(400).json({ message: 'Invalid page name' });
    }
    
    // Find and update or create new
    const page = await Page.findOneAndUpdate(
      { name },
      { 
        title, 
        content, 
        metaDescription, 
        lastUpdated: Date.now() 
      },
      { new: true, upsert: true }
    );
    
    res.json(page);
  } catch (error) {
    console.error(`Error updating page ${req.params.name}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;