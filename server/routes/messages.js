const express = require('express');
const router = express.Router();
const { Message } = require('../models');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, async (req, res) => {
    try {
      const messages = await Message.find().sort('-createdAt');
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
  })
  .post(async (req, res) => {
    try {
      if (!req.body.name || !req.body.email || !req.body.message) {
        return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
      }
      const message = await Message.create(req.body);
      res.status(201).json(message);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(400).json({ success: false, message: error.message || 'Failed to send message' });
    }
  });

router.route('/:id')
  .put(protect, async (req, res) => {
    try {
      const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
      res.json(message);
    } catch (error) {
      console.error('Error updating message:', error);
      res.status(400).json({ success: false, message: error.message || 'Failed to update message' });
    }
  })
  .delete(protect, async (req, res) => {
    try {
      const message = await Message.findByIdAndDelete(req.params.id);
      if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
      res.json({ success: true, message: 'Message deleted' });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ success: false, message: 'Failed to delete message' });
    }
  });

module.exports = router;

