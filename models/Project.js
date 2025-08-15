const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Apartments', 'Villas', 'Plots', 'Commercial'],
    required: true
  },
  configuration: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  longDescription: {
    type: String
  },
  mainImage: {
    type: String
  },
  bannerImage: {
    type: String
  },
  galleryImages: [
    { type: String }
  ],
  price: {
    type: String,
    required: true
  },
  startingPrice: {
    type: String
  },
  area: {
    type: String
  },
  possession: {
    type: String
  },
  status: {
    type: String,
    enum: ['Ongoing', 'Completed', 'Upcoming', 'Ready to Move'],
    default: 'Upcoming'
  },
  amenities: [{
    type: String
  }],
  highlights: [{
    type: String
  }],
  reraNumber: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);