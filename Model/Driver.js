const mongoose = require('mongoose');
const { Schema } = mongoose;

const driverSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  photoUrl: {
    type: String,
    default: null,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  experienceYears: {
    type: Number,
    default: 0,
    min: 0,
  },
  tripsCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ['available', 'onTrip', 'offline'],
    default: 'available',
    index: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Driver', driverSchema);
