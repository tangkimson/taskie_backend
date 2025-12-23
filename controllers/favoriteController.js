// Favorite Controller
// Handles favorite tasks for taskers

const Favorite = require('../models/Favorite');
const Task = require('../models/Task');

/**
 * @route   POST /api/favorites
 * @desc    Add task to favorites
 * @access  Private (Tasker)
 */
const addFavorite = async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide taskId' 
      });
    }

    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      taskerId: req.user._id,
      taskId
    });

    if (existingFavorite) {
      return res.status(400).json({ 
        success: false,
        message: 'Task already in favorites' 
      });
    }

    // Create favorite
    const favorite = await Favorite.create({
      taskerId: req.user._id,
      taskId
    });

    res.status(201).json({
      success: true,
      message: 'Task added to favorites',
      data: favorite
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error adding favorite' 
    });
  }
};

/**
 * @route   GET /api/favorites
 * @desc    Get user's favorite tasks
 * @access  Private (Tasker)
 */
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ taskerId: req.user._id })
      .populate({
        path: 'taskId',
        populate: {
          path: 'requester',
          select: 'fullName email phone avatarUrl'
        }
      })
      .sort({ createdAt: -1 }); // Newest first

    // Filter out favorites where task was deleted
    const validFavorites = favorites.filter(fav => fav.taskId !== null);

    res.json({
      success: true,
      count: validFavorites.length,
      data: validFavorites
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching favorites' 
    });
  }
};

/**
 * @route   DELETE /api/favorites/:taskId
 * @desc    Remove task from favorites
 * @access  Private (Tasker)
 */
const removeFavorite = async (req, res) => {
  try {
    const { taskId } = req.params;

    const favorite = await Favorite.findOne({
      taskerId: req.user._id,
      taskId
    });

    if (!favorite) {
      return res.status(404).json({ 
        success: false,
        message: 'Favorite not found' 
      });
    }

    await favorite.deleteOne();

    res.json({
      success: true,
      message: 'Task removed from favorites'
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error removing favorite' 
    });
  }
};

/**
 * @route   GET /api/favorites/check/:taskId
 * @desc    Check if task is favorited by user
 * @access  Private (Tasker)
 */
const checkFavorite = async (req, res) => {
  try {
    const { taskId } = req.params;

    const favorite = await Favorite.findOne({
      taskerId: req.user._id,
      taskId
    });

    res.json({
      success: true,
      data: {
        isFavorited: !!favorite
      }
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error checking favorite status' 
    });
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
  checkFavorite
};




















