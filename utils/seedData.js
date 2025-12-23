// Seed Data Utility
// Smart seeding function that only seeds if database is empty
// Safe to run multiple times - won't delete existing data

const JobCategory = require('../models/JobCategory');
const Location = require('../models/Location');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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

// Location data for Huế city
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

/**
 * Seed database with initial data
 * Only seeds if collections are empty (safe to run multiple times)
 * @param {boolean} force - If true, will clear and reseed (default: false)
 * @returns {Promise<Object>} Seed results
 */
const seedDatabase = async (force = false) => {
  try {
    const results = {
      categories: { inserted: 0, skipped: false },
      locations: { inserted: 0, skipped: false },
      admin: { created: false, skipped: false }
    };

    // Check if data already exists
    const categoryCount = await JobCategory.countDocuments();
    const locationCount = await Location.countDocuments();
    const adminExists = await User.findOne({ email: 'admin@taskie.com' });

    // Seed Job Categories
    if (force || categoryCount === 0) {
      if (force && categoryCount > 0) {
        console.log('🗑️  Clearing existing job categories...');
        await JobCategory.deleteMany({});
      }
      
      console.log('📝 Seeding job categories...');
      await JobCategory.insertMany(categories);
      results.categories.inserted = categories.length;
      console.log(`✅ Inserted ${categories.length} job categories`);
    } else {
      results.categories.skipped = true;
      console.log(`ℹ️  Job categories already exist (${categoryCount} found). Skipping...`);
    }

    // Seed Locations
    if (force || locationCount === 0) {
      if (force && locationCount > 0) {
        console.log('🗑️  Clearing existing locations...');
        await Location.deleteMany({});
      }
      
      console.log('📍 Seeding location data...');
      await Location.insertMany(locations);
      results.locations.inserted = locations.length;
      console.log(`✅ Inserted ${locations.length} location(s)`);
    } else {
      results.locations.skipped = true;
      console.log(`ℹ️  Locations already exist (${locationCount} found). Skipping...`);
    }

    // Create default admin user
    if (!adminExists) {
      console.log('👤 Creating default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        fullName: 'Admin User',
        dateOfBirth: new Date('1990-01-01'),
        email: 'admin@taskie.com',
        password: hashedPassword,
        currentRole: 'admin'
      });
      results.admin.created = true;
      console.log('✅ Created admin user (admin@taskie.com / admin123)');
    } else {
      results.admin.skipped = true;
      console.log('ℹ️  Admin user already exists');
    }

    return {
      success: true,
      results,
      message: 'Database seeding completed successfully!'
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

/**
 * Check if database needs seeding
 * @returns {Promise<boolean>} True if database is empty and needs seeding
 */
const needsSeeding = async () => {
  try {
    const categoryCount = await JobCategory.countDocuments();
    const locationCount = await Location.countDocuments();
    return categoryCount === 0 || locationCount === 0;
  } catch (error) {
    console.error('Error checking if seeding is needed:', error);
    return false;
  }
};

module.exports = {
  seedDatabase,
  needsSeeding
};

