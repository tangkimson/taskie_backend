// Admin Controller
// Handles admin operations

const User = require('../models/User');
const Task = require('../models/Task');
const Message = require('../models/Message');

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

module.exports = {
  getUsers,
  getTasks,
  getStats
};









