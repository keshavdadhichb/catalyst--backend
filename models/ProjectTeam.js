const mongoose = require('mongoose');

const projectTeamSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['leader', 'student_researcher', 'collaborator']
  },
  doj: {
    type: Date,
    default: Date.now
  },
  end_date: Date,
  status: {
    type: String,
    enum: ['active', 'completed', 'withdrawn']
  },
  taskassigned: String
});

module.exports = mongoose.model('ProjectTeam', projectTeamSchema); 