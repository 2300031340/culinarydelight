const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Dummy OTP store (in-memory, for demo only)
const otpStore = {};

// Request OTP
router.post('/request-otp', (req, res) => {
  const { emailOrPhone, password, userType } = req.body;
  // Store the OTP for this email/phone (in production, send via email/SMS)
  otpStore[emailOrPhone] = '123456';
  res.json({ message: 'OTP sent (use 123456 as dummy OTP)' });
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  const { emailOrPhone, otp } = req.body;
  if (otpStore[emailOrPhone] && otp === otpStore[emailOrPhone]) {
    res.json({ message: 'OTP verified' });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
});

// Register user/chef
router.post('/register', async (req, res) => {
  try {
    const { emailOrPhone, password, userType, username, name, experienceYears, bio, specialties } = req.body;
    // Check if user already exists
    const existing = await User.findOne({ emailOrPhone });
    if (existing) {
      return res.status(400).json({ message: 'Account already exists with this email or phone.' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user object
    const userData = {
      emailOrPhone,
      password: hashedPassword,
      userType,
    };
    if (userType === 'USER') {
      userData.username = username;
    } else if (userType === 'CHEF') {
      userData.name = name;
      userData.experienceYears = experienceYears;
      userData.bio = bio;
      userData.specialties = specialties;
    }
    const user = new User(userData);
    await user.save();
    res.json({ message: 'Account created successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { emailOrPhone, password, userType } = req.body;
  try {
    const user = await User.findOne({ emailOrPhone, userType });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    // Create a JWT token
    const token = jwt.sign({ id: user._id, userType: user.userType }, 'your_jwt_secret', { expiresIn: '1d' });
    res.json({ message: 'Login successful', token, userType: user.userType });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 