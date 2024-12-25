const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const upload = require('../../middleware/fileUpload');
const StudentProfile = require('../../models/StudentProfile');
const { verifyToken } = require('../auth');

// Validation rules
const validateStudentProfile = [
  body('name').notEmpty().trim(),
  body('phonenumber').matches(/^\+?[\d\s-]{8,}$/),
  body('regnumber').notEmpty(),
  body('yearofstudy').isInt({ min: 1, max: 5 }),
  body('cgpa').optional().isFloat({ min: 0, max: 10 })
];

// Get all student profiles
router.get('/', verifyToken, async (req, res) => {
  try {
    const profiles = await StudentProfile.find().populate('user_id', '-pass');
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student profile by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const profile = await StudentProfile.findById(req.params.id)
      .populate('user_id', '-pass');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create student profile with file upload
router.post('/', 
  verifyToken,
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'pfp', maxCount: 1 }
  ]),
  validateStudentProfile,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const profileData = {
        ...req.body,
        user_id: req.user.id
      };

      // Add file paths if files were uploaded
      if (req.files) {
        if (req.files.resume) {
          profileData.resume = req.files.resume[0].path;
        }
        if (req.files.pfp) {
          profileData.pfp = req.files.pfp[0].path;
        }
      }

      const profile = new StudentProfile(profileData);
      const newProfile = await profile.save();
      res.status(201).json(newProfile);
    } catch (err) {
      next(err);
    }
});

// Update student profile
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const profile = await StudentProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (profile.user_id.toString() !== req.user.id && req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedProfile = await StudentProfile.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedProfile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete student profile
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const profile = await StudentProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (profile.user_id.toString() !== req.user.id && req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await StudentProfile.findByIdAndDelete(req.params.id);
    res.json({ message: 'Profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 