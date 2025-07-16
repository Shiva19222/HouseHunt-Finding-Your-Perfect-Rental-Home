const Property = require('../models/Property');

exports.createProperty = async (req, res) => {
  try {
    const newProperty = new Property({ ...req.body, ownerId: req.user.id });
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating property', error: err.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isAvailable: true });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching properties' });
  }
};

exports.getOwnerProperties = async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.user.id });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching owner properties' });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    await Property.findByIdAndDelete(id);
    res.json({ msg: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting property' });
  }
};
