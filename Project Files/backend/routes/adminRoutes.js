// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// GET: List of pending owners
router.get('/pending-owners', authMiddleware, async (req, res) => {
  try {
    const owners = await User.find({ type: 'Owner', isApproved: false });
    res.json(owners);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending owners' });
  }
});

// PUT: Approve owner
router.put('/approve-owner/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve owner' });
  }
});

module.exports = router; // ✅ This must export `router`
