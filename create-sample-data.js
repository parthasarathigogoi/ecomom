const mongoose = require('mongoose');
const Project = require('./models/Project');
const BlogPost = require('./models/BlogPost');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecomom', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample projects
const sampleProjects = [
  {
    title: 'Prestige Pallavaram Gardens',
    city: 'Chennai',
    location: 'Pallavaram',
    type: 'Apartments',
    status: 'Ongoing',
    shortDescription: 'Luxury apartments in the heart of Chennai with world-class amenities.',
    longDescription: 'Prestige Pallavaram Gardens offers meticulously designed 2, 3, and 4 BHK apartments spread across 15 acres of prime land. This prestigious development features state-of-the-art amenities including a clubhouse, swimming pool, gymnasium, landscaped gardens, and 24/7 security. Located in Pallavaram, it provides excellent connectivity to Chennai International Airport, IT parks, and major commercial hubs.',
    mainImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1674&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    ],
    startingPrice: '₹75 Lakhs Onwards',
    configuration: '2, 3 & 4 BHK Apartments',
    area: '1200 - 2400 sq.ft.',
    possession: 'December 2025',
    amenities: ['Clubhouse', 'Swimming Pool', 'Gymnasium', 'Children\'s Play Area', 'Jogging Track', '24/7 Security', 'Power Backup', 'Landscaped Gardens'],
    highlights: ['15 acres of prime land', 'Close to Chennai International Airport', 'Excellent connectivity', 'Premium specifications', 'World-class amenities'],
    reraNumber: 'TN/29/Building/001/2023',
    featured: true
  },
  {
    title: 'Prestige Lakeside Habitat',
    city: 'Bangalore',
    location: 'Whitefield',
    type: 'Apartments',
    status: 'Ongoing',
    shortDescription: 'Premium lake-facing apartments in Bangalore\'s IT hub.',
    longDescription: 'Prestige Lakeside Habitat is a premium residential development located in Whitefield, Bangalore\'s thriving IT corridor. This expansive project offers 1, 2, 3, and 4 BHK apartments with stunning lake views and world-class amenities. Spread across 102 acres, it features a 5-star clubhouse, retail spaces, and extensive green areas.',
    mainImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1674&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1674&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    ],
    startingPrice: '₹65 Lakhs Onwards',
    configuration: '1, 2, 3 & 4 BHK Apartments',
    area: '600 - 2200 sq.ft.',
    possession: 'March 2025',
    amenities: ['5-star Clubhouse', 'Swimming Pool', 'Tennis Court', 'Basketball Court', 'Jogging Track', 'Gymnasium', 'Spa', 'Restaurant', 'Retail Spaces'],
    highlights: ['102 acres of development', 'Lake-facing apartments', 'Located in Whitefield', '5-star amenities', 'Excellent connectivity to IT parks'],
    reraNumber: 'PRM/KA/RERA/1251/446/PR/180318/001598',
    featured: true
  },
  {
    title: 'Prestige West Woods',
    city: 'Bangalore',
    location: 'Mysore Road',
    type: 'Apartments',
    status: 'Completed',
    shortDescription: 'Modern apartments with contemporary architecture and premium amenities.',
    longDescription: 'Prestige West Woods is a completed residential project located on Mysore Road, Bangalore. This modern development offers 2 and 3 BHK apartments with contemporary architecture and premium specifications. The project features extensive amenities including a clubhouse, swimming pool, gymnasium, and landscaped gardens.',
    mainImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1674&q=80',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    ],
    startingPrice: '₹85 Lakhs Onwards',
    configuration: '2 & 3 BHK Apartments',
    area: '1100 - 1800 sq.ft.',
    possession: 'Ready to Move In',
    amenities: ['Clubhouse', 'Swimming Pool', 'Gymnasium', 'Children\'s Play Area', 'Multipurpose Hall', '24/7 Security', 'Power Backup'],
    highlights: ['Ready to move in', 'Modern architecture', 'Prime location on Mysore Road', 'Premium specifications', 'Immediate possession available'],
    reraNumber: 'PRM/KA/RERA/1251/446/PR/180318/001599',
    featured: true
  }
];

// Sample blogs
const sampleBlogs = [
  {
    title: 'Top 5 Reasons to Invest in Prestige Properties',
    shortDescription: 'Discover why Prestige Construction is the trusted choice for real estate investment in India.',
    fullContent: `Investing in real estate is one of the most significant financial decisions you'll make. When it comes to choosing the right developer, Prestige Construction stands out for several compelling reasons.

**1. Legacy of Excellence**
With over three decades of experience and 300+ completed projects, Prestige has established itself as a trusted name in Indian real estate. Our track record speaks for itself with consistent delivery of quality projects.

**2. Prime Locations**
All Prestige projects are strategically located in areas with excellent connectivity, proximity to IT parks, educational institutions, and healthcare facilities. This ensures not just comfortable living but also excellent appreciation potential.

**3. World-Class Amenities**
From 5-star clubhouses to Olympic-sized swimming pools, every Prestige development comes equipped with amenities that enhance your lifestyle and provide value for your investment.

**4. Quality Construction**
We use only the finest materials and employ cutting-edge construction techniques. Our projects undergo rigorous quality checks at every stage of development.

**5. Transparent Processes**
With RERA registration and clear documentation, investing in Prestige properties is completely transparent and secure. We believe in building trust through honest communication and ethical practices.

Whether you're a first-time homebuyer or a seasoned investor, Prestige Construction offers the perfect blend of luxury, value, and peace of mind.`,
    coverImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
  },
  {
    title: 'The Future of Smart Homes: Prestige\'s Vision',
    shortDescription: 'Explore how Prestige Construction is leading the smart home revolution in India.',
    fullContent: `The concept of smart homes is rapidly evolving, and Prestige Construction is at the forefront of this revolution. Our latest projects incorporate cutting-edge technology to create living spaces that are not just luxurious but also intelligent.

**Integrated Home Automation**
Our smart homes feature integrated automation systems that allow you to control lighting, temperature, security, and entertainment systems through your smartphone or voice commands.

**Energy Efficiency**
Smart meters and energy management systems help optimize power consumption, reducing your carbon footprint while saving on utility bills.

**Enhanced Security**
From biometric access to AI-powered surveillance systems, our smart homes prioritize your safety and security without compromising on privacy.

**Future-Ready Infrastructure**
All our developments are built with future technologies in mind, ensuring your home remains relevant and valuable for years to come.

**Sustainable Living**
Smart homes contribute to sustainable living through efficient resource management and eco-friendly features.

As we move towards a more connected future, Prestige Construction continues to innovate, ensuring our residents enjoy the benefits of technology while maintaining the comfort and luxury they expect.`,
    coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1674&q=80'
  },
  {
    title: 'Interior Design Trends for 2024: Making Your Prestige Home Shine',
    shortDescription: 'Stay updated with the latest interior design trends to make your Prestige home truly exceptional.',
    fullContent: `Your Prestige home deserves interiors that match its exceptional quality. Here are the top interior design trends for 2024 that will help you create a space that's both stylish and functional.

**Biophilic Design**
Bring nature indoors with living walls, natural materials, and abundant greenery. This trend promotes wellness and creates a calming environment.

**Warm Minimalism**
Clean lines and clutter-free spaces remain popular, but with warmer color palettes and textured materials for added coziness.

**Multifunctional Spaces**
With remote work becoming permanent for many, designing spaces that serve multiple purposes is essential. Think convertible furniture and smart storage solutions.

**Sustainable Materials**
Eco-friendly materials like bamboo, reclaimed wood, and recycled metals are not just trendy but also environmentally responsible choices.

**Bold Colors and Patterns**
While neutrals remain popular, 2024 sees a resurgence of bold colors and geometric patterns used as accent features.

**Smart Furniture**
Furniture with built-in technology, wireless charging, and space-saving features are becoming standard in modern homes.

Our design team at Prestige Construction stays updated with these trends to ensure our model apartments and design consultations provide you with the latest inspiration for your dream home.`,
    coverImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
  }
];

async function createSampleData() {
  try {
    // Clear existing data
await Project.deleteMany({});
await BlogPost.deleteMany({});
    
    // Insert sample projects
    await Project.insertMany(sampleProjects);
    console.log('Sample projects created successfully');
    
    // Insert sample blogs
await BlogPost.insertMany(sampleBlogs);
    console.log('Sample blogs created successfully');
    
    console.log('Sample data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample data:', error);
    process.exit(1);
  }
}

createSampleData();