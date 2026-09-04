const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporterName: {
    type: String,
    required: [true, 'Reporter name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  area: {
    type: String,
    required: [true, 'Area is required'],
    trim: true,
  },
  issueType: {
    type: String,
    required: [true, 'Issue type is required'],
    enum: {
      values: ['Missed Collection', 'Overflowing Waste', 'Illegal Dumping', 'Other'],
      message: '{VALUE} is not a valid issue type',
    },
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: {
      values: ['Low', 'Medium', 'High'],
      message: '{VALUE} is not a valid priority',
    },
    default: 'Medium',
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['Pending', 'In Progress', 'Resolved'],
      message: '{VALUE} is not a valid status',
    },
    default: 'Pending',
  },
  resolutionNote: {
    type: String,
    default: '',
    trim: true,
  },
  reportedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

reportSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Report', reportSchema);
