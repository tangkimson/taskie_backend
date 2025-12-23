// Database Reset Script
// This script completely deletes all data from all collections
// Use with caution! This will permanently delete all data.
//
// Usage:
//   npm run reset          - Reset local database (requires confirmation)
//   FORCE=true npm run reset - Skip confirmation (use with extreme caution)
//
// For production:
//   MONGODB_URI=<your-production-uri> npm run reset

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const readline = require('readline');

// Load environment variables
dotenv.config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask for confirmation
const askConfirmation = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
};

// Reset database function
const resetDatabase = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Host: ${conn.connection.host}`);

    // Safety check - show what will be deleted
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (collectionNames.length === 0) {
      console.log('ℹ️  Database is already empty. Nothing to reset.');
      rl.close();
      process.exit(0);
    }

    console.log('\n⚠️  WARNING: This will DELETE ALL DATA from the following collections:');
    collectionNames.forEach(name => {
      console.log(`   - ${name}`);
    });

    // Check if force flag is set
    const force = process.env.FORCE === 'true';
    
    if (!force) {
      console.log('\n⚠️  This action cannot be undone!');
      const confirmed = await askConfirmation('\nType "yes" to confirm: ');
      
      if (!confirmed) {
        console.log('❌ Reset cancelled by user.');
        rl.close();
        await mongoose.connection.close();
        process.exit(0);
      }
    } else {
      console.log('\n⚠️  FORCE mode enabled - skipping confirmation!');
    }

    // Delete all collections
    console.log('\n🗑️  Deleting all collections...');
    
    for (const collectionName of collectionNames) {
      try {
        await mongoose.connection.db.collection(collectionName).deleteMany({});
        console.log(`   ✅ Deleted all documents from: ${collectionName}`);
      } catch (error) {
        console.error(`   ❌ Error deleting ${collectionName}:`, error.message);
      }
    }

    // Drop all collections
    console.log('\n🗑️  Dropping all collections...');
    for (const collectionName of collectionNames) {
      try {
        await mongoose.connection.db.collection(collectionName).drop();
        console.log(`   ✅ Dropped collection: ${collectionName}`);
      } catch (error) {
        // Collection might already be dropped or not exist
        if (error.code !== 26) { // 26 = namespace not found
          console.error(`   ⚠️  Error dropping ${collectionName}:`, error.message);
        }
      }
    }

    console.log('\n✨ Database reset completed successfully!');
    console.log('👉 You can now run: npm run seed');
    
    rl.close();
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    rl.close();
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

// Run reset function
resetDatabase();

