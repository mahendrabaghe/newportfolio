const express = require('express');
const router = express.Router();
const { Experience } = require('../models');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(async (req, res) => {
    try {
      const experiences = await Experience.find().sort('order');
      res.json(experiences);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch experiences' });
    }
  })
  .post(protect, async (req, res) => {
    try {
      if (!req.body.company || !req.body.position) {
        return res.status(400).json({ success: false, message: 'Company and position are required' });
      }
      const experience = await Experience.create(req.body);
      res.status(201).json(experience);
    } catch (error) {
      console.error('Error creating experience:', error);
      res.status(400).json({ success: false, message: error.message || 'Failed to create experience' });
    }
  });

router.route('/:id')
  .get(async (req, res) => {
    try {
      const experience = await Experience.findById(req.params.id);
      if (!experience) return res.status(404).json({ success: false, message: 'Experience not found' });
      res.json(experience);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch experience' });
    }
  })
  .put(protect, async (req, res) => {
    try {
      const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!experience) return res.status(404).json({ success: false, message: 'Experience not found' });
      res.json(experience);
    } catch (error) {
      console.error('Error updating experience:', error);
      res.status(400).json({ success: false, message: error.message || 'Failed to update experience' });
    }
  })
  .delete(protect, async (req, res) => {
    try {
      const experience = await Experience.findByIdAndDelete(req.params.id);
      if (!experience) return res.status(404).json({ success: false, message: 'Experience not found' });
      res.json({ success: true, message: 'Experience deleted' });
    } catch (error) {
      console.error('Error deleting experience:', error);
      res.status(500).json({ success: false, message: 'Failed to delete experience' });
    }
  });

module.exports = router;

