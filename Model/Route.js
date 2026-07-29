const mongoose = require('mongoose');
const { Schema } = mongoose;

const routeSchema = new Schema({
  startStationId: {
    type: Schema.Types.ObjectId,
    ref: 'Station',
    required: true,
  },
  endStationId: {
    type: Schema.Types.ObjectId,
    ref: 'Station',
    required: true,
  },
  distance: {
    type: Number, // decimal (km)
    required: true,
  },
  estimatedDuration: {
    type: Number, // minutes
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
});

module.exports = mongoose.model('Route', routeSchema);
