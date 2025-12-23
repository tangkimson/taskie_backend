// Admin Controller
// Handles admin operations

const User = require('../models/User');
const Task = require('../models/Task');
const Message = require('../models/Message');
const Favorite = require('../models/Favorite');
const JobCategory = require('../models/JobCategory');
const Location = require('../models/Location');
const mongoose = require('mongoose');
const { seedDatabase } = require('../utils/seedData');
const { comprehensiveSeed } = require('../utils/comprehensiveSeedData');

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching users' 
    });
  }
};

/**
 * @route   GET /api/admin/tasks
 * @desc    Get all tasks
 * @access  Private (Admin only)
 */
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('requester', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching tasks' 
    });
  }
};

/**
 * @route   GET /api/admin/stats
 * @desc    Get basic statistics
 * @access  Private (Admin only)
 */
const getStats = async (req, res) => {
  try {
    // Count totals
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();
    const totalMessages = await Message.countDocuments();

    // Count by role
    const requesters = await User.countDocuments({ currentRole: 'requester' });
    const taskers = await User.countDocuments({ currentRole: 'tasker' });
    const admins = await User.countDocuments({ currentRole: 'admin' });

    // Count tasks by status
    const pendingTasks = await Task.countDocuments({ status: 'pending' });
    const completedTasks = await Task.countDocuments({ status: 'completed' });

    // Recent tasks (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentTasks = await Task.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });

    // Recent users (last 7 days)
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          requesters,
          taskers,
          admins,
          recent: recentUsers
        },
        tasks: {
          total: totalTasks,
          pending: pendingTasks,
          completed: completedTasks,
          recent: recentTasks
        },
        messages: {
          total: totalMessages
        }
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching statistics' 
    });
  }
};

/**
 * @route   POST /api/admin/reset
 * @desc    Reset database - Delete all data (Admin only)
 * @access  Private (Admin only)
 */
const resetDatabase = async (req, res) => {
  try {
    console.log('🗑️  Admin requested database reset...');
    
    // Delete all collections
    const collections = [
      Task,
      Message,
      Favorite,
      JobCategory,
      Location,
      User
    ];

    const results = {};
    
    for (const Model of collections) {
      const collectionName = Model.collection.name;
      const count = await Model.countDocuments();
      await Model.deleteMany({});
      results[collectionName] = { deleted: count };
      console.log(`   ✅ Deleted ${count} documents from ${collectionName}`);
    }

    res.json({
      success: true,
      message: 'Database reset completed successfully',
      results
    });
  } catch (error) {
    console.error('Reset database error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error resetting database',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   POST /api/admin/seed
 * @desc    Seed database with initial data (Admin only)
 * @access  Private (Admin only)
 */
const seedDatabaseEndpoint = async (req, res) => {
  try {
    const { force, comprehensive } = req.body;
    
    console.log('🌱 Admin requested database seeding...');
    
    if (comprehensive === true) {
      // Comprehensive seed (users, tasks, messages, favorites)
      const result = await comprehensiveSeed();
      res.json({
        success: true,
        message: 'Comprehensive database seeding completed successfully',
        summary: result.summary
      });
    } else {
      // Basic seed (categories, locations, admin only)
      const result = await seedDatabase(force === true);
      res.json({
        success: true,
        message: result.message,
        results: result.results
      });
    }
  } catch (error) {
    console.error('Seed database error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error seeding database',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   POST /api/admin/reset-and-seed
 * @desc    Reset and seed database in one operation (Admin only)
 * @access  Private (Admin only)
 */
const resetAndSeed = async (req, res) => {
  try {
    const { comprehensive } = req.body;
    
    console.log('🔄 Admin requested database reset and seed...');
    
    // First reset
    const collections = [
      Task,
      Message,
      Favorite,
      JobCategory,
      Location,
      User
    ];

    for (const Model of collections) {
      await Model.deleteMany({});
    }
    
    console.log('✅ Database reset completed, starting seed...');
    
    // Then seed
    if (comprehensive === true) {
      const result = await comprehensiveSeed();
      res.json({
        success: true,
        message: 'Database reset and comprehensive seeding completed successfully',
        summary: result.summary
      });
    } else {
      const result = await seedDatabase(true);
      res.json({
        success: true,
        message: 'Database reset and basic seeding completed successfully',
        results: result.results
      });
    }
  } catch (error) {
    console.error('Reset and seed error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error resetting and seeding database',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getUsers,
  getTasks,
  getStats,
  resetDatabase,
  seedDatabaseEndpoint,
  resetAndSeed
};









