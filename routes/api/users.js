const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { verifyToken } = require('../auth'); // Import the verifyToken middleware

// Get all users (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const users = await User.find().select('-pass');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-pass');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { 
        $set: {
          email: req.body.email,
          facorstudent: req.body.facorstudent,
          completeornot: req.body.completeornot,
          active: req.body.active
        }
      },
      { new: true }
    ).select('-pass');

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 