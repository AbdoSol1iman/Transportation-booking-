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
  },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
