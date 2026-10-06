const express = require('express');
const router = express.Router();
const { Education } = require('../models');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(async (req, res) => {
    try {
      const education = await Education.find();
      res.json(education);
    } catch (error) {
      console.error('Error fetching education:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch education records' });
    }
  })
  .post(protect, async (req, res) => {
    try {
      if (!req.body.degree || !req.body.university) {
        return res.status(400).json({ success: false, message: 'Degree and university are required' });
      }
      const edu = await Education.create(req.body);
      res.status(201).json(edu);
    } catch (error) {
      console.error('Error creating education:', error);
      res.status(400).json({ success: false, message: error.message || 'Failed to create education record' });
    }
  });

router.route('/:id')
  .get(async (req, res) => {
    try {
      const edu = await Education.findById(req.params.id);
      if (!edu) return res.status(404).json({ success: false, message: 'Education record not found' });
      res.json(edu);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch education record' });
    }
  })
  .put(protect, async (req, res) => {
    try {
      const edu = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!edu) return res.status(404).json({ success: false, message: 'Education record not found' });
      res.json(edu);
    } catch (error) {
      console.error('Error updating education:', error);
      res.status(400).json({ success: false, message: error.message || 'Failed to update education record' });
    }
  })
  .delete(protect, async (req, res) => {
    try {
      const edu = await Education.findByIdAndDelete(req.params.id);
      if (!edu) return res.status(404).json({ success: false, message: 'Education record not found' });
      res.json({ success: true, message: 'Education record deleted' });
    } catch (error) {
      console.error('Error deleting education:', error);
      res.status(500).json({ success: false, message: 'Failed to delete education record' });
    }
  });

module.exports = router;

