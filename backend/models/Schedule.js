const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  areaName: {
    type: String,
    required: [true, 'Area name is required'],
    trim: true,
  },
  collectionDay: {
    type: String,
    required: [true, 'Collection day is required'],
    trim: true,
  },
  collectionTime: {
    type: String,
    required: [true, 'Collection time is required'],
    trim: true,
  },
  wasteType: {
    type: String,
    required: [true, 'Waste type is required'],
    trim: true,
  },
  status: {
    type: String,
    default: 'Active',
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Schedule', scheduleSchema);
