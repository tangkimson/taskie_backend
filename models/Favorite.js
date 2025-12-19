// Favorite Model
// Represents tasks favorited by taskers

const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  // Reference to the tasker who favorited
  taskerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Reference to the favorited task
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Ensure a tasker can only favorite a task once
favoriteSchema.index({ taskerId: 1, taskId: 1 }, { unique: true });

// Virtual populate for task details
favoriteSchema.virtual('task', {
  ref: 'Task',
  localField: 'taskId',
  foreignField: '_id',
  justOne: true
});

// Ensure virtuals are included in JSON
favoriteSchema.set('toJSON', { virtuals: true });
favoriteSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Favorite', favoriteSchema);


















