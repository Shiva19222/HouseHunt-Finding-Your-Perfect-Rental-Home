// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  type: {
    type: String,
    enum: ['Renter', 'Owner', 'Admin'],
    required: true
  },
  isApproved: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
