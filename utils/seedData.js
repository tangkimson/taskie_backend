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

// Location data - Multiple provinces/cities
// Structure designed to easily add more provinces in the future
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
  },
  {
    province: 'Thành phố Hạ Long',
    wards: [
      'Phường Bạch Đằng',
      'Phường Bãi Cháy',
      'Phường Cao Thắng',
      'Phường Cao Xanh',
      'Phường Đại Yên',
      'Phường Giếng Đáy',
      'Phường Hà Khánh',
      'Phường Hà Khẩu',
      'Phường Hà Lầm',
      'Phường Hà Phong',
      'Phường Hà Trung',
      'Phường Hà Tu',
      'Phường Hồng Gai',
      'Phường Hồng Hà',
      'Phường Hồng Hải',
      'Phường Hùng Thắng',
      'Phường Trần Hưng Đạo',
      'Phường Tuần Châu',
      'Phường Việt Hưng',
      'Phường Yết Kiêu',
      'Xã Bằng Cả',
      'Xã Dân Chủ',
      'Xã Đồng Lâm',
      'Xã Đồng Sơn',
      'Xã Hòa Bình',
      'Xã Kỳ Thượng',
      'Xã Lê Lợi',
      'Xã Sơn Dương',
      'Xã Tân Dân',
      'Xã Thống Nhất',
      'Xã Vũ Oai'
    ]
  },
  {
    province: 'Thành phố Móng Cái',
    wards: [
      'Phường Bình Ngọc',
      'Phường Hải Hòa',
      'Phường Hải Yên',
      'Phường Hòa Lạc',
      'Phường Ka Long',
      'Phường Ninh Dương',
      'Phường Trà Cổ',
      'Phường Trần Phú',
      'Xã Bắc Sơn',
      'Xã Hải Đông',
      'Xã Hải Sơn',
      'Xã Hải Tiến',
      'Xã Hải Xuân',
      'Xã Quảng Nghĩa',
      'Xã Vạn Ninh',
      'Xã Vĩnh Thực',
      'Xã Vĩnh Trung'
    ]
  },
  {
    province: 'Thành phố Cẩm Phả',
    wards: [
      'Phường Cẩm Bình',
      'Phường Cẩm Đông',
      'Phường Cẩm Phú',
      'Phường Cẩm Sơn',
      'Phường Cẩm Tây',
      'Phường Cẩm Thạch',
      'Phường Cẩm Thành',
      'Phường Cẩm Thịnh',
      'Phường Cẩm Thủy',
      'Phường Cẩm Trung',
      'Phường Cửa Ông',
      'Phường Mông Dương',
      'Phường Quang Hanh',
      'Xã Cẩm Hải',
      'Xã Cộng Hòa',
      'Xã Dương Huy'
    ]
  },
  {
    province: 'Thành phố Uông Bí',
    wards: [
      'Phường Bắc Sơn',
      'Phường Nam Khê',
      'Phường Phương Đông',
      'Phường Phương Nam',
      'Phường Quang Trung',
      'Phường Thanh Sơn',
      'Phường Trưng Vương',
      'Phường Vàng Danh',
      'Phường Yên Thanh',
      'Xã Điền Công',
      'Xã Phương Đông',
      'Xã Thượng Yên Công',
      'Xã Yên Thượng'
    ]
  },
  {
    province: 'Thị xã Quảng Yên',
    wards: [
      'Phường Cộng Hòa',
      'Phường Đông Mai',
      'Phường Hà An',
      'Phường Minh Thành',
      'Phường Nam Hòa',
      'Phường Phong Cốc',
      'Phường Phong Hải',
      'Phường Quảng Yên',
      'Phường Tân An',
      'Phường Yên Giang',
      'Phường Yên Hải',
      'Xã Cẩm La',
      'Xã Hiệp Hòa',
      'Xã Hoàng Tân',
      'Xã Liên Hòa',
      'Xã Liên Vị',
      'Xã Sông Khoai',
      'Xã Tiền An',
      'Xã Tiền Phong'
    ]
  },
  {
    province: 'Huyện Vân Đồn',
    wards: [
      'Thị trấn Cái Rồng',
      'Xã Bản Sen',
      'Xã Bình Dân',
      'Xã Đài Xuyên',
      'Xã Đoàn Kết',
      'Xã Đông Xá',
      'Xã Hạ Long',
      'Xã Minh Châu',
      'Xã Ngọc Vừng',
      'Xã Quan Lạn',
      'Xã Thắng Lợi',
      'Xã Vạn Yên'
    ]
  },
  {
    province: 'Huyện Cô Tô',
    wards: [
      'Thị trấn Cô Tô',
      'Xã Đồng Tiến',
      'Xã Thanh Lân'
    ]
  },
  {
    province: 'Huyện Đông Triều',
    wards: [
      'Thị trấn Đông Triều',
      'Thị trấn Mạo Khê',
      'Xã An Sinh',
      'Xã Bình Dương',
      'Xã Bình Khê',
      'Xã Đức Chính',
      'Xã Hồng Phong',
      'Xã Hồng Thái Đông',
      'Xã Hồng Thái Tây',
      'Xã Hưng Đạo',
      'Xã Kim Sơn',
      'Xã Nguyễn Huệ',
      'Xã Tân Việt',
      'Xã Thủy An',
      'Xã Tràng An',
      'Xã Tràng Lương',
      'Xã Việt Dân',
      'Xã Xuân Sơn',
      'Xã Yên Đức',
      'Xã Yên Thọ'
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
    if (force) {
      // Force mode: clear and reseed everything
      if (locationCount > 0) {
        console.log('🗑️  Clearing existing locations...');
        await Location.deleteMany({});
      }
      
      console.log('📍 Seeding location data...');
      await Location.insertMany(locations);
      results.locations.inserted = locations.length;
      const totalWards = locations.reduce((sum, loc) => sum + loc.wards.length, 0);
      console.log(`✅ Inserted ${locations.length} province(s)/city(ies) with ${totalWards} total wards/communes`);
    } else if (locationCount === 0) {
      // Database is empty: insert all locations
      console.log('📍 Seeding location data...');
      await Location.insertMany(locations);
      results.locations.inserted = locations.length;
      const totalWards = locations.reduce((sum, loc) => sum + loc.wards.length, 0);
      console.log(`✅ Inserted ${locations.length} province(s)/city(ies) with ${totalWards} total wards/communes`);
    } else {
      // Database has some locations: add missing ones intelligently
      console.log('📍 Checking for missing locations...');
      let insertedCount = 0;
      let totalNewWards = 0;
      
      for (const location of locations) {
        const exists = await Location.findOne({ province: location.province });
        if (!exists) {
          await Location.create(location);
          insertedCount++;
          totalNewWards += location.wards.length;
          console.log(`  ✅ Added: ${location.province} (${location.wards.length} wards/communes)`);
        }
      }
      
      if (insertedCount > 0) {
        results.locations.inserted = insertedCount;
        console.log(`✅ Added ${insertedCount} new location(s) with ${totalNewWards} total wards/communes`);
      } else {
        results.locations.skipped = true;
        console.log(`ℹ️  All locations already exist (${locationCount} found). No new locations added.`);
      }
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

