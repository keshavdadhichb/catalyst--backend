const express = require('express');
const router = express.Router();
const ProjectApplication = require('../../models/ProjectApplication');
const Project = require('../../models/Project');
const { verifyToken } = require('../auth');

// Get all applications for a project
router.get('/project/:projectId', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (project.createdby.toString() !== req.user.id && req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const applications = await ProjectApplication.find({ project_id: req.params.projectId })
      .populate('student_id', '-pass')
      .populate('project_id');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student's applications
router.get('/student', verifyToken, async (req, res) => {
  try {
    const applications = await ProjectApplication.find({ student_id: req.user.id })
      .populate('project_id')
      .populate('student_id', '-pass');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get application by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const application = await ProjectApplication.findById(req.params.id)
      .populate('student_id', '-pass')
      .populate('project_id');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user has permission to view this application
    const project = await Project.findById(application.project_id);
    if (application.student_id.toString() !== req.user.id && 
        project.createdby.toString() !== req.user.id && 
        req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit application
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.facorstudent !== 'student') {
      return res.status(403).json({ message: 'Only students can apply for projects' });
    }

    // Check if already applied
    const existingApplication = await ProjectApplication.findOne({
      project_id: req.body.project_id,
      student_id: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this project' });
    }

    const application = new ProjectApplication({
      project_id: req.body.project_id,
      student_id: req.user.id,
      status: 'pending'
    });

    const newApplication = await application.save();
    res.status(201).json(newApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update application status (faculty only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const application = await ProjectApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const project = await Project.findById(application.project_id);
    if (project.createdby.toString() !== req.user.id && req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    application.status = req.body.status;
    application.faculty_notes = req.body.faculty_notes;
    
    const updatedApplication = await application.save();
    res.json(updatedApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Withdraw application (student only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const application = await ProjectApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.student_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot withdraw processed application' });
    }

    application.status = 'withdrawn';
    await application.save();
    
    res.json({ message: 'Application withdrawn successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 