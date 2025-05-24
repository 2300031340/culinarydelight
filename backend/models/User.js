const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  emailOrPhone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['USER', 'CHEF'], required: true },
  // User fields
  username: { type: String },
  // Chef fields
  name: { type: String },
  experienceYears: { type: Number },
  bio: { type: String },
  specialties: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 