const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const {
  getOwnerProperties,
  deleteProperty
} = require('../controllers/propertyController');

const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// ✅ Create Property with Image Upload
// routes/propertyRoutes.js
router.post('/create', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'Owner' || !user.isApproved) {
      return res.status(403).json({ message: 'Owner not approved by admin' });
    }

    const { type, adType, address, contact, amount, info, specificDate } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const newProperty = new Property({
      type, adType, address, contact, amount, info, specificDate, image,
      owner: req.user.id
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create property' });
  }
});

// ✅ Get All Properties for Renters (with owner info)
router.get('/all', async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email contact');
    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
});



// ✅ Get Properties of Logged-In Owner
router.get('/my', authMiddleware, getOwnerProperties);

// ✅ Update Property
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update property' });
  }
});

// ✅ Delete Property
router.delete('/:id', authMiddleware, deleteProperty);

module.exports = router;
