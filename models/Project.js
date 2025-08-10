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
  type: {
    type: String,
    enum: ['Residential', 'Commercial', 'Other'],
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
    type: String // URL or path to image
  },
  galleryImages: [
    { type: String } // Array of URLs or paths
  ],
  price: {
    type: Number
  },
  startingPrice: {
    type: Number
  },
  status: {
    type: String,
    enum: ['Ongoing', 'Completed', 'Upcoming'],
    default: 'Upcoming'
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);