const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const setupSwagger = require('./config/swagger');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/user');
const bookingRoutes = require('./routes/bookingRoutes');
const driverRoutes = require('./routes/driverRoutes');
const reviewRoutes = require('./routes/review.routes');
const tripRoutes = require('./routes/trip');
const vehicleRoutes = require('./routes/vehiclesRoutes');
const stationRoutes = require('./routes/stationRoutes');
const routeRoutes = require('./routes/routeRoutes');

const globalErrorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/AppError');
const { startAutoCloseJob } = require('./utils/autoCloseTrips');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());

// Rate Limiter: Increased limit for development & testing to prevent 429 Too Many Requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

setupSwagger(app);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/drivers', driverRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/trips', tripRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/stations', stationRoutes);
app.use('/api/v1/routes', routeRoutes);

app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);
app.use('/trips', tripRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/stations', stationRoutes);
app.use('/routes', routeRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Transportation System API is running smoothly',
    documentation: 'http://localhost:3000/api-docs',
  });
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI environment variable is missing in .env file!');
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('✅ Connected successfully to MongoDB');
      // Start background job: auto-close expired / fully-booked trips every 60s
      startAutoCloseJob(60_000);
    })
    .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err);
    });
}

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📖 Swagger Documentation UI: http://localhost:${port}/api-docs`);
  });
}

module.exports = app;