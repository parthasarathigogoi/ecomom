const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const multer = require('multer');
const path = require('path');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/projects/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single project by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new project (admin only)
router.post('/', upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 10 }]), async (req, res) => {
  console.log('Request body:', req.body);
  const project = new Project({
    title: req.body.title,
    city: req.body.city,
    location: req.body.location,
    configuration: req.body.configuration,
    type: req.body.type,
    shortDescription: req.body.shortDescription,
    longDescription: req.body.longDescription,
    price: req.body.price,
    startingPrice: req.body.startingPrice,
    status: req.body.status
  });

  if (req.files && req.files['mainImage']) {
    project.mainImage = '/uploads/projects/' + req.files['mainImage'][0].filename;
  }
  if (req.files && req.files['galleryImages']) {
    project.galleryImages = req.files['galleryImages'].map(file => '/uploads/projects/' + file.filename);
  }

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update project (admin only)
router.patch('/:id', upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 10 }]), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Update fields
    Object.keys(req.body).forEach(key => {
      project[key] = req.body[key];
    });

    if (req.files && req.files['mainImage']) {
      project.mainImage = '/uploads/projects/' + req.files['mainImage'][0].filename;
    }
    if (req.files && req.files['galleryImages']) {
      const newGalleryImages = req.files['galleryImages'].map(file => '/uploads/projects/' + file.filename);
      project.galleryImages = [...project.galleryImages, ...newGalleryImages];
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete project (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await Project.deleteOne({ _id: req.params.id });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;