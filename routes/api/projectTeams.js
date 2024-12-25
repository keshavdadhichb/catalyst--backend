const express = require('express');
const router = express.Router();
const ProjectTeam = require('../../models/ProjectTeam');
const Project = require('../../models/Project');
const { verifyToken } = require('../auth');

// Get all team members for a project
router.get('/project/:projectId', verifyToken, async (req, res) => {
  try {
    const teams = await ProjectTeam.find({ project_id: req.params.projectId })
      .populate('user_id', '-pass')
      .populate('project_id');
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get team member by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const team = await ProjectTeam.findById(req.params.id)
      .populate('user_id', '-pass')
      .populate('project_id');
    if (!team) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add team member
router.post('/', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.body.project_id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdby.toString() !== req.user.id && req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const team = new ProjectTeam({
      project_id: req.body.project_id,
      user_id: req.body.user_id,
      role: req.body.role,
      status: 'active',
      taskassigned: req.body.taskassigned
    });

    const newTeam = await team.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update team member
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const team = await ProjectTeam.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    const project = await Project.findById(team.project_id);
    if (project.createdby.toString() !== req.user.id && req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedTeam = await ProjectTeam.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove team member
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const team = await ProjectTeam.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    const project = await Project.findById(team.project_id);
    if (project.createdby.toString() !== req.user.id && req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await ProjectTeam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team member removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 