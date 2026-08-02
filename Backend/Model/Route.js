const mongoose = require('mongoose');
const { Schema } = mongoose;

const routeSchema = new Schema({
  startStationId: {
    type: Schema.Types.ObjectId,
    ref: 'Station',
    required: true,
    index: true,
  },
  endStationId: {
    type: Schema.Types.ObjectId,
    ref: 'Station',
    required: true,
    index: true,
  },
  distance: {
    type: Number, // km
    required: true,
    min: [0.1, 'Distance must be greater than 0'],
  },
  estimatedDuration: {
    type: Number, // minutes
    required: true,
    min: [1, 'Estimated duration must be at least 1 minute'],
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

routeSchema.index({ startStationId: 1, endStationId: 1 }, { unique: true });

module.exports = mongoose.model('Route', routeSchema);
