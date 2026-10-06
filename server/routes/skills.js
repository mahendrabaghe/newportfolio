const express = require('express');
const router = express.Router();
const { Skill } = require('../models');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(async (req, res) => {
    try {
      const skills = await Skill.find().sort('order');
      res.json(skills);
    } catch (error) {
      console.error('Error fetching skills:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch skills' });
    }
  })
  .post(protect, async (req, res) => {
    try {
      if (!req.body.category) {
        return res.status(400).json({ success: false, message: 'Category is required' });
      }
      const skill = await Skill.create(req.body);
      res.status(201).json(skill);
    } catch (error) {
      console.error('Error creating skill category:', error);
      res.status(400).json({ success: false, message: error.message || 'Failed to create skill' });
    }
  });

router.route('/:id')
  .get(async (req, res) => {
    try {
      const skill = await Skill.findById(req.params.id);
      if (!skill) return res.status(404).json({ success: false, message: 'Skill category not found' });
      res.json(skill);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch skill category' });
    }
  })
  .put(protect, async (req, res) => {
    try {
      const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!skill) return res.status(404).json({ success: false, message: 'Skill category not found' });
      res.json(skill);
    } catch (error) {
      console.error('Error updating skill category:', error);
      res.status(400).json({ success: false, message: error.message || 'Failed to update skill' });
    }
  })
  .delete(protect, async (req, res) => {
    try {
      const skill = await Skill.findByIdAndDelete(req.params.id);
      if (!skill) return res.status(404).json({ success: false, message: 'Skill category not found' });
      res.json({ success: true, message: 'Skill category deleted' });
    } catch (error) {
      console.error('Error deleting skill category:', error);
      res.status(500).json({ success: false, message: 'Failed to delete skill category' });
    }
  });

module.exports = router;

