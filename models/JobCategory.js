// JobCategory Model
// Represents job categories with their associated posting fees

const mongoose = require('mongoose');

const jobCategorySchema = new mongoose.Schema({
  // Category name
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  
  // Posting fee for this category (in VND)
  postingFee: {
    type: Number,
    required: [true, 'Posting fee is required'],
    min: [0, 'Posting fee must be a positive number']
  },
  
  // Optional description
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('JobCategory', jobCategorySchema);


















