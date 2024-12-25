const express = require('express');
const router = express.Router();
const ProjectUpdate = require('../../models/ProjectUpdate');
const Project = require('../../models/Project');
const ProjectTeam = require('../../models/ProjectTeam');
const { verifyToken } = require('../auth');

// Get all updates for a project
router.get('/project/:projectId', verifyToken, async (req, res) => {
  try {
    const updates = await ProjectUpdate.find({ project_id: req.params.projectId })
      .populate('posted_by', '-pass')
      .populate('project_id')
      .sort({ posted_at: -1 });
    res.json(updates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get update by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const update = await ProjectUpdate.findById(req.params.id)
      .populate('posted_by', '-pass')
      .populate('project_id');
    
    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }
    res.json(update);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create update
router.post('/', verifyToken, async (req, res) => {
  try {
    // Check if user is part of the project team
    const isTeamMember = await ProjectTeam.findOne({
      project_id: req.body.project_id,
      user_id: req.user.id,
      status: 'active'
    });

    const project = await Project.findById(req.body.project_id);
    if (!isTeamMember && project.createdby.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only team members can post updates' });
    }

    const update = new ProjectUpdate({
      project_id: req.body.project_id,
      posted_by: req.user.id,
      update_type: req.body.update_type,
      title: req.body.title,
      desc: req.body.desc,
      attachment_urls: req.body.attachment_urls
    });

    const newUpdate = await update.save();
    res.status(201).json(newUpdate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update project update
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const update = await ProjectUpdate.findById(req.params.id);
    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }

    if (update.posted_by.toString() !== req.user.id && req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedUpdate = await ProjectUpdate.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedUpdate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete project update
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const update = await ProjectUpdate.findById(req.params.id);
    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }

    if (update.posted_by.toString() !== req.user.id && req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await ProjectUpdate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Update deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 