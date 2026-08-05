const { z } = require('zod');
const { ROLES } = require('../config/roles');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// User / Auth Schemas
const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  phone: z.string().min(8, 'Phone number must be at least 8 digits').trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(Object.values(ROLES)).optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

// Driver Schema
const createDriverSchema = z.object({
  fullName: z.string().min(2).trim(),
  phone: z.string().min(8).trim(),
  licenseNumber: z.string().min(3).trim(),
  photoUrl: z.string().url().nullable().optional(),
  experienceYears: z.number().min(0).optional(),
});

// Vehicle Schema
const createVehicleSchema = z.object({
  plateNumber: z.string().min(2).trim(),
  model: z.string().min(1).trim(),
  capacity: z.number().int().positive('Capacity must be a positive integer'),
  vehicleType: z.enum(['bus', 'minibus', 'van']),
  status: z.enum(['active', 'maintenance', 'inactive']).optional(),
});

// Station Schema
const createStationSchema = z.object({
  name: z.string().min(2).trim(),
  city: z.string().min(2).trim(),
  address: z.string().trim().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  status: z.enum(['active', 'inactive']).optional(),
});

// Route Schema
const createRouteSchema = z.object({
  startStationId: z.string().regex(objectIdRegex, 'Invalid startStationId ObjectId'),
  endStationId: z.string().regex(objectIdRegex, 'Invalid endStationId ObjectId'),
  distance: z.number().positive('Distance must be positive'),
  estimatedDuration: z.number().positive('Duration must be positive'),
  status: z.enum(['active', 'inactive']).optional(),
});

// Trip Schema
const createTripSchema = z.object({
  routeId: z.string().regex(objectIdRegex, 'Invalid routeId ObjectId'),
  vehicleId: z.string().regex(objectIdRegex, 'Invalid vehicleId ObjectId'),
  driverId: z.string().regex(objectIdRegex, 'Invalid driverId ObjectId'),
  departureTime: z.string().datetime({ message: 'Departure time must be a valid ISO Date' }),
  arrivalTime: z.string().datetime({ message: 'Arrival time must be a valid ISO Date' }),
  price: z.number().min(0, 'Price cannot be negative'),
  capacity: z.number().int().positive('Capacity must be positive'),
  status: z.enum(['scheduled', 'inProgress', 'completed', 'cancelled']).optional(),
  imageUrl: z.string().optional(),
});

// Booking Schema
const createBookingSchema = z.object({
  tripId: z.string().regex(objectIdRegex, 'Invalid tripId ObjectId'),
  passengers: z.number().int().positive('Passengers count must be at least 1'),
  paymentMethod: z.enum(['cash', 'card', 'wallet']),
});

// Review Schema
const createReviewSchema = z.object({
  tripId: z.string().regex(objectIdRegex, 'Invalid tripId ObjectId'),
  rating: z.number().min(1).max(5),
  comment: z.string().trim().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updatePasswordSchema,
  createDriverSchema,
  createVehicleSchema,
  createStationSchema,
  createRouteSchema,
  createTripSchema,
  createBookingSchema,
  createReviewSchema,
};
