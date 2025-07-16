const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      type: 'Admin',
      isApproved: true
    });
    await admin.save();
    console.log('✅ Admin created successfully');
    mongoose.disconnect();
  })
  .catch((err) => console.error('DB Error:', err));
