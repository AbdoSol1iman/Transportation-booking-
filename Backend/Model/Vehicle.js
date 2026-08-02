const mongoose = require('mongoose');
const { Schema } = mongoose;

const vehicleSchema = new Schema({
  plateNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: [1, 'Capacity must be at least 1'],
  },
  vehicleType: {
    type: String,
    enum: ['bus', 'minibus', 'van'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'inactive'],
    default: 'active',
    index: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
