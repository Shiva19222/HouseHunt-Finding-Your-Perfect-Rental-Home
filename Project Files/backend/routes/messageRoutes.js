const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Property = require('../models/Property');
const auth = require('../middleware/authMiddleware');

// ✅ Renter sends a message to the property owner
router.post('/send', auth, async (req, res) => {
  try {
    const { propertyId, content } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const message = new Message({
      property: propertyId,
      sender: req.user.id,
      receiver: property.owner,
      content,
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// ✅ Owner views inbox
router.get('/inbox', auth, async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user.id })
      .populate('sender', 'name email')
      .populate('property', 'type address');
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load inbox' });
  }
});

// ✅ Owner replies
router.post('/reply/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    message.reply = req.body.reply;
    await message.save();
    res.json({ message: 'Reply sent', data: message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send reply' });
  }
});

// ✅ Renter sees their chat history per property
router.get('/thread/:propertyId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      property: req.params.propertyId,
      sender: req.user.id
    })
      .populate('receiver', 'name email')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load thread' });
  }
});

module.exports = router;
