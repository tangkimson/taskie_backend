// Profile Controller
// Handles user profile operations

const User = require('../models/User');

/**
 * @route   GET /api/profile
 * @desc    Get user profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching profile' 
    });
  }
};

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const { fullName, dateOfBirth, email, phone } = req.body;

    // Find user
    const user = await User.findById(req.user._id);

    // Update fields if provided
    if (fullName) user.fullName = fullName;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    // Save user (password won't be re-hashed because it's not modified)
    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error updating profile' 
    });
  }
};

/**
 * @route   POST /api/profile/avatar
 * @desc    Upload user avatar
 * @access  Private
 */
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Please upload an image file' 
      });
    }

    // Update user avatar URL
    const user = await User.findById(req.user._id);
    user.avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error uploading avatar' 
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar
};












