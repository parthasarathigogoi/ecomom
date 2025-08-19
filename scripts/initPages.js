const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  initializePages();
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Import Page model
const Page = require('../models/Page');

// Default page content
const defaultPages = [
  {
    name: 'home',
    title: 'Welcome to EcoMom - Sustainable Real Estate',
    content: {
      heroTitle: 'Sustainable Living Spaces',
      heroSubtitle: 'Eco-friendly homes for a better tomorrow',
      heroImage: '/img/hero-image.jpg',
      featuredProjectsTitle: 'Featured Projects',
      aboutSectionTitle: 'About EcoMom',
      aboutSectionContent: '<p>EcoMom is dedicated to creating sustainable living spaces that harmonize with nature while providing modern comfort and luxury.</p>',
      testimonialsSectionTitle: 'What Our Clients Say'
    },
    metaDescription: 'EcoMom - Sustainable real estate development company specializing in eco-friendly homes and apartments.'
  },
  {
    name: 'about',
    title: 'About Us - EcoMom',
    content: {
      mainHeading: 'Our Story',
      mainContent: '<p>Founded in 2010, EcoMom has been at the forefront of sustainable real estate development. Our mission is to create living spaces that are not only beautiful and comfortable but also environmentally responsible.</p>',
      teamSectionTitle: 'Meet Our Team',
      missionStatement: '<p>Our mission is to revolutionize the real estate industry by making sustainability the standard, not the exception.</p>',
      visionStatement: '<p>We envision a world where every home contributes positively to the environment and enhances the quality of life for its inhabitants.</p>'
    },
    metaDescription: 'Learn about EcoMom\'s journey, mission, and vision in sustainable real estate development.'
  },
  {
    name: 'contact',
    title: 'Contact Us - EcoMom',
    content: {
      mainHeading: 'Get in Touch',
      introText: '<p>We\'d love to hear from you. Whether you\'re interested in our projects or have questions about sustainable living, our team is here to help.</p>',
      address: '123 Green Street, Eco City, EC 12345',
      phone: '+1 (555) 123-4567',
      email: 'info@ecomom.com',
      mapEmbedCode: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573036704!2d-73.98784492426285!3d40.75798657138946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
    },
    metaDescription: 'Contact EcoMom for inquiries about our sustainable real estate projects or to schedule a visit.'
  },
  {
    name: 'projects',
    title: 'Our Projects - EcoMom',
    content: {
      mainHeading: 'Sustainable Living Projects',
      introText: '<p>Explore our portfolio of eco-friendly residential and commercial projects. Each development is designed with sustainability at its core.</p>'
    },
    metaDescription: 'Browse EcoMom\'s portfolio of sustainable real estate projects, featuring eco-friendly homes and commercial spaces.'
  },
  {
    name: 'blog',
    title: 'Blog - EcoMom',
    content: {
      mainHeading: 'Sustainable Living Insights',
      introText: '<p>Stay updated with the latest trends in sustainable living, green building technologies, and eco-friendly interior design.</p>'
    },
    metaDescription: 'Read EcoMom\'s blog for insights on sustainable living, green building practices, and eco-friendly interior design.'
  }
];

// Initialize pages
async function initializePages() {
  try {
    for (const page of defaultPages) {
      // Check if page already exists
      const existingPage = await Page.findOne({ name: page.name });
      
      if (!existingPage) {
        // Create new page with default content
        await Page.create(page);
        console.log(`Created default page: ${page.name}`);
      } else {
        console.log(`Page already exists: ${page.name}`);
      }
    }
    
    console.log('Page initialization complete');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing pages:', error);
    process.exit(1);
  }
}