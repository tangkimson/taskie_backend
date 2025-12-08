// Authentication middleware
// This middleware checks if the user has a valid JWT token

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes - requires valid JWT token
 * Adds user object to request (req.user)
 */
const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (format: "Bearer TOKEN")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, token failed' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token provided' 
    });
  }
};

/**
 * Middleware to check if user has admin role
 */
const admin = (req, res, next) => {
  if (req.user && req.user.currentRole === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Not authorized as admin' 
    });
  }
};

/**
 * Middleware to check if user is a requester
 */
const requester = (req, res, next) => {
  if (req.user && req.user.currentRole === 'requester') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Not authorized, requester role required' 
    });
  }
};

/**
 * Middleware to check if user is a tasker
 */
const tasker = (req, res, next) => {
  if (req.user && req.user.currentRole === 'tasker') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Not authorized, tasker role required' 
    });
  }
};

module.exports = { protect, admin, requester, tasker };












