// User Model
// Represents users in the system (can be requester, tasker, or admin)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic user information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  
  // Contact information (user can use either email or phone to login)
  email: {
    type: String,
    sparse: true, // Allows multiple null values
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Email is optional but if provided must be valid
        if (!v) return true;
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  phone: {
    type: String,
    sparse: true, // Allows multiple null values
    trim: true,
    validate: {
      validator: function(v) {
        // Phone is optional but if provided must be valid
        if (!v) return true;
        return /^[0-9]{10,11}$/.test(v);
      },
      message: 'Please enter a valid phone number (10-11 digits)'
    }
  },
  
  // Password (hashed)
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  
  // Proof of experience (uploaded file URL)
  proofOfExperienceUrl: {
    type: String,
    default: null
  },
  
  // Avatar image
  avatarUrl: {
    type: String,
    default: null
  },
  
  // Current role (can be changed by user)
  currentRole: {
    type: String,
    enum: ['requester', 'tasker', 'admin'],
    default: undefined,
    required: false
    // No default - field will be undefined until user chooses role
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

// Validate that user has at least email or phone
userSchema.pre('save', function(next) {
  if (!this.email && !this.phone) {
    next(new Error('Either email or phone number is required'));
  } else {
    next();
  }
});

// Hash password before saving user
userSchema.pre('save', async function(next) {
  // Only hash password if it's new or modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

