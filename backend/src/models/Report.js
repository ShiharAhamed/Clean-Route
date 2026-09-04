import mongoose from 'mongoose';

export const ALLOWED_ISSUE_TYPES = [
  'Missed Collection',
  'Overflowing Waste',
  'Illegal Dumping',
  'Other',
];

export const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High'];

export const ALLOWED_STATUSES = ['Pending', 'In Progress', 'Resolved'];

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
      values: ALLOWED_ISSUE_TYPES,
      message: '{VALUE} is not a supported issue type',
    },
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  priority: {
    type: String,
    enum: {
      values: ALLOWED_PRIORITIES,
      message: '{VALUE} is not a supported priority',
    },
    default: 'Medium',
  },
  status: {
    type: String,
    enum: {
      values: ALLOWED_STATUSES,
      message: '{VALUE} is not a supported status',
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
  this.updatedAt = new Date();
  next();
});

export const Report = mongoose.model('Report', reportSchema);
