const express = require('express');
const router = express.Router();
const DomainDesc = require('../../models/DomainDesc');
const { verifyToken } = require('../auth');

// Get all domains
router.get('/', async (req, res) => {
  try {
    const domains = await DomainDesc.find({ is_active: true });
    res.json(domains);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get domain by ID
router.get('/:id', async (req, res) => {
  try {
    const domain = await DomainDesc.findById(req.params.id);
    if (!domain) {
      return res.status(404).json({ message: 'Domain not found' });
    }
    res.json(domain);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create domain (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const domain = new DomainDesc({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description
    });

    const newDomain = await domain.save();
    res.status(201).json(newDomain);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update domain (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedDomain = await DomainDesc.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedDomain) {
      return res.status(404).json({ message: 'Domain not found' });
    }

    res.json(updatedDomain);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete domain (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.facorstudent !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const domain = await DomainDesc.findById(req.params.id);
    if (!domain) {
      return res.status(404).json({ message: 'Domain not found' });
    }

    // Soft delete by setting is_active to false
    domain.is_active = false;
    await domain.save();

    res.json({ message: 'Domain deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 