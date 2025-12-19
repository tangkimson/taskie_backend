// Location Model
// Represents provinces/cities and their wards/communes
// For this project, we focus on Huế city

const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  // Province/City name
  province: {
    type: String,
    required: [true, 'Province name is required'],
    unique: true,
    trim: true
  },
  
  // List of wards/communes in this province
  wards: [{
    type: String,
    required: true
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);


















