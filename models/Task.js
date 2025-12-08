// Task Model
// Represents a task posted by a requester

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  // Task basic information
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Task description is required']
  },
  
  // Job category (e.g., Assembly, Repair, Delivery)
  category: {
    type: String,
    required: [true, 'Job category is required']
  },
  
  // Task images (at least 2 required)
  images: [{
    type: String,
    required: true
  }],
  
  // Location information
  location: {
    province: {
      type: String,
      required: [true, 'Province/City is required']
    },
    ward: {
      type: String,
      required: [true, 'Ward/Commune is required']
    }
  },
  
  // Price offered by requester
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number']
  },
  
  // Posting fee (calculated based on job category)
  postingFee: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Deadline for task completion
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  
  // Payment proof image URL (automatically approved)
  paymentProofUrl: {
    type: String,
    default: null
  },
  
  // Task status
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  
  // Reference to the requester (user who created the task)
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Indexes for faster queries
taskSchema.index({ requesterId: 1, status: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ 'location.province': 1, 'location.ward': 1 });
taskSchema.index({ price: 1 });
taskSchema.index({ createdAt: -1 });

// Virtual populate for requester details
taskSchema.virtual('requester', {
  ref: 'User',
  localField: 'requesterId',
  foreignField: '_id',
  justOne: true
});

// Ensure virtuals are included in JSON
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);









