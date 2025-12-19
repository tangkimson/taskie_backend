// Location Controller
// Handles locations (provinces and wards)

const Location = require('../models/Location');

/**
 * @route   GET /api/locations
 * @desc    Get all locations
 * @access  Public
 */
const getLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ province: 1 });

    res.json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching locations' 
    });
  }
};

module.exports = {
  getLocations
};


















