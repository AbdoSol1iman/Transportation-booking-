const mongoose = require('mongoose');
const { Schema } = mongoose;

const tripSchema = new Schema({
  routeId: {
    type: Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  currentPassengers: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['scheduled', 'inProgress', 'completed', 'cancelled'],
    default: 'scheduled',
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: false },
});

module.exports = mongoose.model('Trip', tripSchema);
