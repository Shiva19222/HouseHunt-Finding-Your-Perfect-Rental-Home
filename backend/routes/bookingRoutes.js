// backend/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const User = require('../models/User');
const sendEmail = require('../utils/emailService'); // Ensure this exists

// ✅ Booking API
router.post('/book', authMiddleware, async (req, res) => {
  try {
    const { propertyId, message } = req.body;
    const userId = req.user.id;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const booking = new Booking({
      userId,
      property: propertyId,
      message,
    });
    await booking.save();

    // Email Notification
    const renter = await User.findById(userId);
    const owner = await User.findById(property.owner);

    await sendEmail(owner.email, 'New Booking Request', `
Hi ${owner.name},

You received a new booking request from ${renter.name} (${renter.email}) for the property at ${property.address}.

Message: ${message}

Login to HouseHunt to approve or reject the booking.

Thanks,  
HouseHunt Team
    `);

    res.status(201).json({ message: 'Booking created successfully' });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Booking failed' });
  }
});

module.exports = router;
