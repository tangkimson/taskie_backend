// Category Controller
// Handles job categories

const JobCategory = require('../models/JobCategory');

/**
 * @route   GET /api/categories
 * @desc    Get all job categories
 * @access  Public
 */
const getCategories = async (req, res) => {
  try {
    const categories = await JobCategory.find().sort({ name: 1 });

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching categories' 
    });
  }
};

module.exports = {
  getCategories
};





















