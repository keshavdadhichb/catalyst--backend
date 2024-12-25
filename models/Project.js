const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  createdby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  short_desc: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['research', 'development', 'thesis', 'internship']
  },
  start: Date,
  end: Date,
  deadline: Date,
  duration: Number,
  status: {
    type: String,
    enum: ['draft', 'open', 'in_progress', 'completed', 'cancelled'],
    required: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'invitation_only']
  },
  teamsize: Number,
  paidornot: {
    type: String,
    enum: ['paid', 'unpaid', 'credit_based']
  },
  prerequisites: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: Date,
  is_active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Project', projectSchema); 