// Seed script to populate database with initial data
// Run this with: npm run seed

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const JobCategory = require('../models/JobCategory');
const Location = require('../models/Location');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Job categories with posting fees (in VND)
const categories = [
  {
    name: 'Lắp ráp đồ dùng',
    postingFee: 10000,
    description: 'Assembly of furniture, equipment, etc.'
  },
  {
    name: 'Sửa chữa',
    postingFee: 15000,
    description: 'Repair services for various items'
  },
  {
    name: 'Giao hàng',
    postingFee: 5000,
    description: 'Delivery and transportation services'
  },
  {
    name: 'Vệ sinh',
    postingFee: 8000,
    description: 'Cleaning services'
  },
  {
    name: 'Chuyển nhà',
    postingFee: 20000,
    description: 'Moving services'
  },
  {
    name: 'Làm vườn',
    postingFee: 12000,
    description: 'Gardening and landscaping'
  },
  {
    name: 'Giúp việc nhà',
    postingFee: 10000,
    description: 'Household chores'
  },
  {
    name: 'Khác',
    postingFee: 10000,
    description: 'Other miscellaneous tasks'
  }
];

// Location data for Huế city (updated October 2025)
const locations = [
  {
    province: 'Thành phố Huế',
    wards: [
      'Phường Phú Hòa',
      'Phường Phú Cát',
      'Phường Phú Hậu',
      'Phường Phú Hiệp',
      'Phường Phú Hội',
      'Phường Phú Nhuận',
      'Phường Thuận Thành',
      'Phường Thuận Lộc',
      'Phường Thuận Hòa',
      'Phường Kim Long',
      'Phường Vỹ Dạ',
      'Phường Phường Đúc',
      'Phường Vĩnh Ninh',
      'Phường Xuân Phú',
      'Phường Trường An',
      'Phường Thuỷ Biều',
      'Phường Thuỷ Xuân',
      'Phường An Cựu',
      'Phường An Hòa',
      'Phường An Đông',
      'Phường An Tây',
      'Phường Hương Sơ',
      'Phường Hương Long',
      'Phường Hương Hồ',
      'Phường Hương Vinh',
      'Phường Hương An'
    ]
  }
];

// Connect to database and seed data
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await JobCategory.deleteMany({});
    await Location.deleteMany({});
    
    // Insert categories
    console.log('📝 Inserting job categories...');
    await JobCategory.insertMany(categories);
    console.log(`✅ Inserted ${categories.length} job categories`);

    // Insert locations
    console.log('📍 Inserting location data...');
    await Location.insertMany(locations);
    console.log(`✅ Inserted ${locations.length} location(s)`);

    // Create a default admin user
    console.log('👤 Creating default admin user...');
    const adminExists = await User.findOne({ email: 'admin@taskie.com' });
    
    if (!adminExists) {
      await User.create({
        fullName: 'Admin User',
        dateOfBirth: new Date('1990-01-01'),
        email: 'admin@taskie.com',
        password: 'admin123',
        currentRole: 'admin'
      });
      console.log('✅ Created admin user (admin@taskie.com / admin123)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - ${categories.length} job categories`);
    console.log(`   - ${locations[0].wards.length} wards in ${locations[0].province}`);
    console.log('   - 1 admin user');
    console.log('\n👉 You can now start the server with: npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();


















