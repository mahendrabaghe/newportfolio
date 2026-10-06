const express = require('express');
const router = express.Router();
const { Certification } = require('../models');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(async (req, res) => {
    try {
      const certifications = await Certification.find();
      res.json(certifications);
    } catch (error) {
      console.error('Error fetching certifications:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch certifications' });
    }
  })
  .post(protect, async (req, res) => {
    try {
      if (!req.body.name) {
        return res.status(400).json({ success: false, message: 'Certification name is required' });
      }
      const cert = await Certification.create(req.body);
      res.status(201).json(cert);
    } catch (error) {
      console.error('Error creating certification:', error);
      res.status(400).json({ success: false, message: error.message || 'Failed to create certification' });
    }
  });

router.route('/:id')
  .get(async (req, res) => {
    try {
      const cert = await Certification.findById(req.params.id);
      if (!cert) return res.status(404).json({ success: false, message: 'Certification not found' });
      res.json(cert);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch certification' });
    }
  })
  .put(protect, async (req, res) => {
    try {
      const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!cert) return res.status(404).json({ success: false, message: 'Certification not found' });
      res.json(cert);
    } catch (error) {
      console.error('Error updating certification:', error);
      res.status(400).json({ success: false, message: error.message || 'Failed to update certification' });
    }
  })
  .delete(protect, async (req, res) => {
    try {
      const cert = await Certification.findByIdAndDelete(req.params.id);
      if (!cert) return res.status(404).json({ success: false, message: 'Certification not found' });
      res.json({ success: true, message: 'Certification deleted' });
    } catch (error) {
      console.error('Error deleting certification:', error);
      res.status(500).json({ success: false, message: 'Failed to delete certification' });
    }
  });

module.exports = router;

