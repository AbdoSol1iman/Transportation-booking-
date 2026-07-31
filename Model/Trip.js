const mongoose = require('mongoose');
const { Schema } = mongoose;

const tripSchema = new Schema({
  routeId: {
    type: Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
    index: true,
  },
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
    index: true,
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
    index: true,
  },
  departureTime: {
    type: Date,
    required: true,
    index: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  capacity: {
    type: Number,
    required: true,
    min: [1, 'Capacity must be at least 1'],
  },
  currentPassengers: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ['scheduled', 'inProgress', 'completed', 'cancelled'],
    default: 'scheduled',
    index: true,
  },
}, {
  timestamps: true,
});

tripSchema.pre('save', function (next) {
  if (this.arrivalTime <= this.departureTime) {
    return next(new Error('ArrivalTime must be after DepartureTime'));
  }
  if (this.currentPassengers > this.capacity) {
    return next(new Error('CurrentPassengers cannot exceed vehicle capacity'));
  }
  next();
});

tripSchema.index({ routeId: 1, departureTime: 1, status: 1 });
tripSchema.index({ driverId: 1, departureTime: 1 });

module.exports = mongoose.model('Trip', tripSchema);
