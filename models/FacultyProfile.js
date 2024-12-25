const mongoose = require('mongoose');

const facultyProfileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  NAME: {
    type: String,
    required: true
  },
  PROFILEPIC: String,
  PHONE: {
    type: String,
    required: true
  },
  bio: String,
  linkedin_url: String,
  github_url: String,
  cabin_number: String,
  free_hours: {
    type: Map,
    of: [String]
  },
  research_interests: [String],
  publications_count: Number,
  last_updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FacultyProfile', facultyProfileSchema); 