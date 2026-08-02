const mongoose = require('mongoose');
const { Schema } = mongoose;

const stationSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Station name is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    index: true,
  },
  address: {
    type: String,
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    index: true,
  },
}, {
  timestamps: true,
});

stationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Station', stationSchema);
