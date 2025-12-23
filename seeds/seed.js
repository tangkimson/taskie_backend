// Seed script to populate database with initial data
// Run this with: npm run seed
// 
// Usage:
//   npm run seed                    - Comprehensive seed with test data (users, tasks, messages, favorites)
//   BASIC=true npm run seed         - Basic seed (categories, locations, admin only)
//   FORCE=true npm run seed          - Force reseed (clears existing data first)

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { seedDatabase } = require('../utils/seedData');
const { comprehensiveSeed } = require('../utils/comprehensiveSeedData');

// Load environment variables
dotenv.config();

// Connect to database and seed data
const runSeed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);

    // Check if basic mode is set
    const basicMode = process.env.BASIC === 'true';
    const force = process.env.FORCE === 'true';
    
    if (basicMode) {
      // Basic seed mode (categories, locations, admin only)
      if (force) {
        console.log('⚠️  FORCE mode enabled - will clear existing data!');
      } else {
        console.log('ℹ️  Safe mode - will only seed if database is empty');
        console.log('   (Use FORCE=true npm run seed to force reseed)');
      }

      const result = await seedDatabase(force);

      console.log('\n✨ Database seeding completed successfully!');
      console.log('\n📋 Summary:');
      console.log(`   - Categories: ${result.results.categories.inserted} inserted${result.results.categories.skipped ? ' (skipped - already exists)' : ''}`);
      console.log(`   - Locations: ${result.results.locations.inserted} province(s)/city(ies) inserted${result.results.locations.skipped ? ' (skipped - already exists)' : ''}`);
      if (result.results.locations.inserted > 0) {
        console.log(`     Includes: Huế, Quảng Ninh (Hạ Long, Móng Cái, Cẩm Phả, Uông Bí, Quảng Yên, Vân Đồn, Cô Tô, Đông Triều)`);
      }
      console.log(`   - Admin user: ${result.results.admin.created ? 'Created' : 'Already exists'}`);
    } else {
      // Comprehensive seed mode (includes test users, tasks, messages, favorites)
      console.log('🌱 Running comprehensive seed with test data...');
      if (force) {
        console.log('⚠️  FORCE mode enabled - will clear existing data first!');
      }
      
      await comprehensiveSeed();
    }

    console.log('\n👉 You can now start the server with: npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
runSeed();




















