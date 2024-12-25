const mongoose = require('mongoose');

const projectApplicationSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  application_date: {
    type: Date,
    default: Date.now
  },
  faculty_notes: String
});

module.exports = mongoose.model('ProjectApplication', projectApplicationSchema); 