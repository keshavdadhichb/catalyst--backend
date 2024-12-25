const express = require('express');
const router = express.Router();
const FacultyProfile = require('../../models/FacultyProfile');
const { verifyToken } = require('../auth');

// Get all faculty profiles
router.get('/', verifyToken, async (req, res) => {
  try {
    const profiles = await FacultyProfile.find().populate('user_id', '-pass');
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get faculty profile by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const profile = await FacultyProfile.findById(req.params.id)
      .populate('user_id', '-pass');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create faculty profile
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.facorstudent !== 'faculty' && req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Only faculty members can create faculty profiles' });
    }

    const profile = new FacultyProfile({
      user_id: req.user.id,
      NAME: req.body.NAME,
      PROFILEPIC: req.body.PROFILEPIC,
      PHONE: req.body.PHONE,
      bio: req.body.bio,
      linkedin_url: req.body.linkedin_url,
      github_url: req.body.github_url,
      cabin_number: req.body.cabin_number,
      free_hours: req.body.free_hours,
      research_interests: req.body.research_interests,
      publications_count: req.body.publications_count
    });

    const newProfile = await profile.save();
    res.status(201).json(newProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update faculty profile
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const profile = await FacultyProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (profile.user_id.toString() !== req.user.id && req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedProfile = await FacultyProfile.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete faculty profile
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const profile = await FacultyProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (profile.user_id.toString() !== req.user.id && req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await FacultyProfile.findByIdAndDelete(req.params.id);
    res.json({ message: 'Profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 