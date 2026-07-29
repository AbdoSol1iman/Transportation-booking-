const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['passenger', 'admin'],
    default: 'passenger',
  },
  status: {
    type: String,
    enum: ['active', 'blocked', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false },
});

module.exports = mongoose.model('User', userSchema);
