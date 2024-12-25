const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  pass: {
    type: String,
    required: true
  },
  facorstudent: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    required: true
  },
  verification: {
    type: Boolean,
    default: false
  },
  createdat: {
    type: Date,
    default: Date.now
  },
  lastlogin: {
    type: Date
  },
  active: {
    type: Boolean,
    default: true
  },
  completeornot: {
    type: String,
    enum: ['pending', 'basic', 'complete'],
    default: 'pending'
  },
  googleId: String // For OAuth
});

module.exports = mongoose.model('User', userSchema); 