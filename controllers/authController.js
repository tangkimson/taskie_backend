// Authentication Controller
// Handles user registration, login, and role management

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate JWT token for user
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token expires in 30 days
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { 
      fullName, 
      dateOfBirth, 
      email, 
      phone, 
      password, 
      confirmPassword 
    } = req.body;

    // Validate required fields
    if (!fullName || !dateOfBirth || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide full name, date of birth, and password' 
      });
    }

    // Check if at least email or phone is provided
    if (!email && !phone) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide either email or phone number' 
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Passwords do not match' 
      });
    }

    // Check if user already exists
    let existingUser = null;
    if (email) {
      existingUser = await User.findOne({ email });
    }
    if (!existingUser && phone) {
      existingUser = await User.findOne({ phone });
    }

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email or phone number' 
      });
    }

    // Handle proof of experience file if uploaded
    let proofOfExperienceUrl = null;
    if (req.file) {
      proofOfExperienceUrl = `/uploads/proofs/${req.file.filename}`;
    }

    // Create user
    const user = await User.create({
      fullName,
      dateOfBirth,
      email,
      phone,
      password,
      proofOfExperienceUrl
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        currentRole: user.currentRole,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error registering user' 
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Validate input
    if (!emailOrPhone || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please enter email/phone number and password' 
      });
    }

    // Find user by email or phone
    let user = await User.findOne({ email: emailOrPhone });
    if (!user) {
      user = await User.findOne({ phone: emailOrPhone });
    }

    // Check if user exists and password matches
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ 
        success: false,
        message: 'Email/phone number or password is incorrect' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        currentRole: user.currentRole,
        avatarUrl: user.avatarUrl,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'An error occurred during login. Please try again later.' 
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching user data' 
    });
  }
};

/**
 * @route   PUT /api/auth/role
 * @desc    Switch user role
 * @access  Private
 */
const switchRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Validate role
    if (!role || !['requester', 'tasker'].includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a valid role (requester or tasker)' 
      });
    }

    // Update user role
    req.user.currentRole = role;
    await req.user.save();

    res.json({
      success: true,
      message: `Role switched to ${role} successfully`,
      data: {
        currentRole: req.user.currentRole
      }
    });
  } catch (error) {
    console.error('Switch role error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error switching role' 
    });
  }
};

/**
 * @route   PUT /api/auth/password
 * @desc    Change user password
 * @access  Private
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get user from database
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  switchRole,
  changePassword
};





