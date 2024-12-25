const mongoose = require('mongoose');

const projectUpdateSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  posted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  update_type: {
    type: String,
    enum: ['progress', 'milestone', 'announcement', 'report']
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  attachment_urls: [String],
  posted_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProjectUpdate', projectUpdateSchema); 