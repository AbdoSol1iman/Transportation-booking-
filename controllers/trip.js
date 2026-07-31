const mongoose = require('mongoose');
const Trip = require('../Model/Trip');

// Get all trips from the database.
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate('routeId vehicleId driverId');

    return res.status(200).json({
      success: true,
      count: trips.length,
      data: trips,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get one trip by its ID.
exports.getTripById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trip id',
      });
    }

    const trip = await Trip.findById(id)
      .populate('routeId vehicleId driverId');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Create a new trip.
exports.createTrip = async (req, res) => {
  try {
    const { routeId, vehicleId, driverId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(routeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid route id',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle id',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid driver id',
      });
    }

    const trip = new Trip(req.body);
    const savedTrip = await trip.save();

    const populatedTrip = await Trip.findById(savedTrip._id)
      .populate('routeId vehicleId driverId');

    return res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: populatedTrip,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update an existing trip by ID.
exports.updateTrip = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trip id',
      });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTrip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    const populatedTrip = await Trip.findById(updatedTrip._id)
      .populate('routeId vehicleId driverId');

    return res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      data: populatedTrip,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Delete a trip by ID.
exports.deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trip id',
      });
    }

    const deletedTrip = await Trip.findByIdAndDelete(id);

    if (!deletedTrip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Trip deleted successfully',
      data: deletedTrip,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
