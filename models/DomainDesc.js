const mongoose = require('mongoose');

const domainDescSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['programming_language', 'framework', 'tool', 'domain_knowledge'],
    required: true
  },
  description: String,
  is_active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('DomainDesc', domainDescSchema); 