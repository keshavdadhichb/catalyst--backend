const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  pfp: String,
  phonenumber: {
    type: String,
    required: true
  },
  regnumber: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  linkedin: String,
  github: String,
  yearofstudy: {
    type: Number,
    required: true
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10
  },
  resume: {
    type: String,
    required: true
  },
  techSTACK1: {
    type: Map,
    of: String
  },
  Stackmore: {
    type: Map,
    of: String
  },
  intersts: [String],
  uodate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema); 