const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['home', 'about', 'contact', 'projects', 'blog']
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: Object,
    required: true
  },
  metaDescription: {
    type: String,
    default: ''
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Page', PageSchema);