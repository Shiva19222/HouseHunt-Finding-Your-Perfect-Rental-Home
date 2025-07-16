const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      type: role, // use 'type' in schema, 'role' from frontend
      isApproved: role === 'Owner' ? false : true
    });

    await newUser.save();
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// ✅ LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.type === 'Owner' && !user.isApproved) {
      return res.status(403).json({ message: 'Owner account not approved yet' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Wrong credentials' });

    const token = jwt.sign({ id: user._id, role: user.type }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, type: user.type } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// ✅ Export both functions
module.exports = {
  registerUser,
  loginUser
};
