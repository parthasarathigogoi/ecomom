const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Media = require('../models/Media');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/uploads/media');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware to verify JWT and check for admin role (assuming it's defined elsewhere or will be imported)
const verifyAdmin = (req, res, next) => {
  // Placeholder for actual admin verification logic
  // In a real app, you'd import this from auth.js or similar
  next(); 
};

// GET all media files
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const media = await Media.find({});
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload a new media file
router.post('/upload', verifyAdmin, upload.single('mediaFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const newMedia = new Media({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: `/uploads/media/${req.file.filename}` // Store relative path
    });

    const savedMedia = await newMedia.save();
    res.status(201).json(savedMedia);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a media file
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '..', 'public', media.path);
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error('Failed to delete file from filesystem:', err);
        return res.status(500).json({ message: 'Failed to delete file from server.' });
      }
      await media.remove();
      res.json({ message: 'Media deleted successfully' });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;