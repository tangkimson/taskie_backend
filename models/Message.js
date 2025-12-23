// Message Model
// Represents messages between requester and tasker about a specific task

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Reference to the task being discussed
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  
  // Sender of the message
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Receiver of the message
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Message content
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  
  // Read status
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Indexes for faster queries
messageSchema.index({ taskId: 1, senderId: 1, receiverId: 1 });
messageSchema.index({ createdAt: -1 });

// Virtual populate for sender and receiver details
messageSchema.virtual('sender', {
  ref: 'User',
  localField: 'senderId',
  foreignField: '_id',
  justOne: true
});

messageSchema.virtual('receiver', {
  ref: 'User',
  localField: 'receiverId',
  foreignField: '_id',
  justOne: true
});

// Ensure virtuals are included in JSON
messageSchema.set('toJSON', { virtuals: true });
messageSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Message', messageSchema);




















