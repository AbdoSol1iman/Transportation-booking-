const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Transportation Management System API',
    version: '1.0.0',
    description: 'Complete Interactive OpenAPI Specification & Documentation for all Transportation API Endpoints.',
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format: Bearer <token>',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66aa11223344556677889900' },
          fullName: { type: 'string', example: 'Ahmed Passenger' },
          email: { type: 'string', example: 'passenger@example.com' },
          phone: { type: 'string', example: '01012345678' },
          role: { type: 'string', enum: ['passenger', 'driver', 'dispatcher', 'admin'], example: 'passenger' },
          status: { type: 'string', enum: ['active', 'blocked', 'inactive'], example: 'active' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Station: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66aa11223344556677889901' },
          name: { type: 'string', example: 'Ramses Central Station' },
          city: { type: 'string', example: 'Cairo' },
          address: { type: 'string', example: 'Ramses Square' },
          location: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'Point' },
              coordinates: { type: 'array', items: { type: 'number' }, example: [31.2497, 30.0626] },
            },
          },
          status: { type: 'string', example: 'active' },
        },
      },
      Route: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66aa11223344556677889902' },
          startStationId: { type: 'string', example: '66aa11223344556677889901' },
          endStationId: { type: 'string', example: '66aa11223344556677889909' },
          distance: { type: 'number', example: 220 },
          estimatedDuration: { type: 'number', example: 180 },
          status: { type: 'string', example: 'active' },
        },
      },
      Driver: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66aa11223344556677889903' },
          fullName: { type: 'string', example: 'Mahmoud Hassan' },
          phone: { type: 'string', example: '01234567890' },
          licenseNumber: { type: 'string', example: 'LIC-99887766' },
          rating: { type: 'number', example: 4.8 },
          status: { type: 'string', example: 'available' },
        },
      },
      Vehicle: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66aa11223344556677889904' },
          plateNumber: { type: 'string', example: 'ABC-1234' },
          model: { type: 'string', example: 'Mercedes Travego' },
          capacity: { type: 'number', example: 50 },
          vehicleType: { type: 'string', enum: ['bus', 'minibus', 'van'], example: 'bus' },
          status: { type: 'string', example: 'active' },
        },
      },
      Trip: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66aa11223344556677889905' },
          routeId: { type: 'string', example: '66aa11223344556677889902' },
          vehicleId: { type: 'string', example: '66aa11223344556677889904' },
          driverId: { type: 'string', example: '66aa11223344556677889903' },
          departureTime: { type: 'string', format: 'date-time', example: '2026-08-10T10:00:00.000Z' },
          arrivalTime: { type: 'string', format: 'date-time', example: '2026-08-10T13:00:00.000Z' },
          price: { type: 'number', example: 150 },
          capacity: { type: 'number', example: 50 },
          currentPassengers: { type: 'number', example: 2 },
          status: { type: 'string', example: 'scheduled' },
        },
      },
      Booking: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66aa11223344556677889906' },
          bookingCode: { type: 'string', example: 'BK-A1B2C3-J4K5L6' },
          userId: { type: 'string', example: '66aa11223344556677889900' },
          tripId: { type: 'string', example: '66aa11223344556677889905' },
          passengers: { type: 'number', example: 2 },
          totalPrice: { type: 'number', example: 300 },
          paymentMethod: { type: 'string', example: 'cash' },
          paymentStatus: { type: 'string', example: 'pending' },
          status: { type: 'string', example: 'confirmed' },
        },
      },
      Review: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66aa11223344556677889907' },
          userId: { type: 'string', example: '66aa11223344556677889900' },
          tripId: { type: 'string', example: '66aa11223344556677889905' },
          rating: { type: 'number', example: 5 },
          comment: { type: 'string', example: 'Excellent bus ride!' },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullName', 'email', 'phone', 'password'],
                properties: {
                  fullName: { type: 'string', example: 'Ahmed Passenger' },
                  email: { type: 'string', example: 'passenger@example.com' },
                  phone: { type: 'string', example: '01012345678' },
                  password: { type: 'string', example: 'Password123' },
                  role: { type: 'string', enum: ['passenger', 'driver', 'dispatcher', 'admin'], example: 'passenger' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Registered successfully' }, 400: { description: 'Validation error' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Log in to account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@transport.com' },
                  password: { type: 'string', example: 'Admin@123456' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Login successful' }, 401: { description: 'Invalid credentials' } },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get logged in user profile',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'User profile retrieved' } },
      },
    },
    '/auth/update-password': {
      patch: {
        tags: ['Authentication'],
        summary: 'Update current user password',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: {
                  currentPassword: { type: 'string', example: 'Password123' },
                  newPassword: { type: 'string', example: 'NewPassword123' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Password updated successfully' } },
      },
    },
    '/users': {
      get: {
        tags: ['Users Management'],
        summary: 'Get all users (Admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'List of users' } },
      },
    },
    '/users/profile': {
      patch: {
        tags: ['Users Management'],
        summary: 'Update current user profile',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fullName: { type: 'string', example: 'Updated Name' },
                  phone: { type: 'string', example: '01099998888' },
                  avatarUrl: { type: 'string', example: 'https://example.com/avatar.jpg' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Profile updated' } },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users Management'],
        summary: 'Get user details by ID',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'User details' } },
      },
      delete: {
        tags: ['Users Management'],
        summary: 'Delete user account (Admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'User deleted' } },
      },
    },
    '/users/{id}/status': {
      patch: {
        tags: ['Users Management'],
        summary: 'Update user status or role (Admin only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  role: { type: 'string', enum: ['passenger', 'driver', 'dispatcher', 'admin'], example: 'admin' },
                  status: { type: 'string', enum: ['active', 'blocked', 'inactive'], example: 'active' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Status updated' } },
      },
    },
    '/stations': {
      get: {
        tags: ['Stations'],
        summary: 'Get all stations',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'city', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'List of stations' } },
      },
      post: {
        tags: ['Stations'],
        summary: 'Create new station (Admin/Dispatcher)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'city', 'latitude', 'longitude'],
                properties: {
                  name: { type: 'string', example: 'Ramses Central Station' },
                  city: { type: 'string', example: 'Cairo' },
                  address: { type: 'string', example: 'Ramses Square' },
                  latitude: { type: 'number', example: 30.0626 },
                  longitude: { type: 'number', example: 31.2497 },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Station created' } },
      },
    },
    '/stations/{id}': {
      get: {
        tags: ['Stations'],
        summary: 'Get station by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Station details' } },
      },
      patch: {
        tags: ['Stations'],
        summary: 'Update station details (Admin/Dispatcher)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Updated Station Name' },
                  address: { type: 'string', example: 'Updated Address' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Station updated' } },
      },
      delete: {
        tags: ['Stations'],
        summary: 'Delete station (Admin/Dispatcher)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Station deleted' } },
      },
    },
    '/routes': {
      get: {
        tags: ['Routes'],
        summary: 'Get all routes',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: { 200: { description: 'List of routes' } },
      },
      post: {
        tags: ['Routes'],
        summary: 'Create new route (Admin/Dispatcher)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['startStationId', 'endStationId', 'distance', 'estimatedDuration'],
                properties: {
                  startStationId: { type: 'string', example: '66aa11223344556677889901' },
                  endStationId: { type: 'string', example: '66aa11223344556677889909' },
                  distance: { type: 'number', example: 220 },
                  estimatedDuration: { type: 'number', example: 180 },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Route created' } },
      },
    },
    '/routes/{id}': {
      get: {
        tags: ['Routes'],
        summary: 'Get route by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Route details' } },
      },
      patch: {
        tags: ['Routes'],
        summary: 'Update route (Admin/Dispatcher)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Route updated' } },
      },
      delete: {
        tags: ['Routes'],
        summary: 'Delete route (Admin/Dispatcher)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Route deleted' } },
      },
    },
    '/drivers': {
      get: {
        tags: ['Drivers'],
        summary: 'Get all drivers',
        responses: { 200: { description: 'List of drivers' } },
      },
      post: {
        tags: ['Drivers'],
        summary: 'Create driver (Admin/Dispatcher)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fullName', 'phone', 'licenseNumber'],
                properties: {
                  fullName: { type: 'string', example: 'Mahmoud Hassan' },
                  phone: { type: 'string', example: '01234567890' },
                  licenseNumber: { type: 'string', example: 'LIC-99887766' },
                  experienceYears: { type: 'number', example: 5 },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Driver created' } },
      },
    },
    '/drivers/{id}': {
      get: {
        tags: ['Drivers'],
        summary: 'Get driver by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Driver details' } },
      },
      patch: {
        tags: ['Drivers'],
        summary: 'Update driver (Admin/Dispatcher)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Driver updated' } },
      },
      delete: {
        tags: ['Drivers'],
        summary: 'Delete driver (Admin/Dispatcher)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Driver deleted' } },
      },
    },
    '/vehicles': {
      get: {
        tags: ['Vehicles'],
        summary: 'Get all vehicles',
        responses: { 200: { description: 'List of vehicles' } },
      },
      post: {
        tags: ['Vehicles'],
        summary: 'Create vehicle (Admin/Dispatcher)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['plateNumber', 'model', 'capacity', 'vehicleType'],
                properties: {
                  plateNumber: { type: 'string', example: 'ABC-1234' },
                  model: { type: 'string', example: 'Mercedes Travego' },
                  capacity: { type: 'number', example: 50 },
                  vehicleType: { type: 'string', enum: ['bus', 'minibus', 'van'], example: 'bus' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Vehicle created' } },
      },
    },
    '/vehicles/{id}': {
      get: {
        tags: ['Vehicles'],
        summary: 'Get vehicle by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Vehicle details' } },
      },
      patch: {
        tags: ['Vehicles'],
        summary: 'Update vehicle (Admin/Dispatcher)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Vehicle updated' } },
      },
      delete: {
        tags: ['Vehicles'],
        summary: 'Delete vehicle (Admin/Dispatcher)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Vehicle deleted' } },
      },
    },
    '/trips': {
      get: {
        tags: ['Trips'],
        summary: 'Get all trips (Filterable)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'routeId', in: 'query', schema: { type: 'string' } },
          { name: 'driverId', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'List of trips' } },
      },
      post: {
        tags: ['Trips'],
        summary: 'Create trip (Admin/Dispatcher)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['routeId', 'vehicleId', 'driverId', 'departureTime', 'arrivalTime', 'price', 'capacity'],
                properties: {
                  routeId: { type: 'string', example: '66aa11223344556677889902' },
                  vehicleId: { type: 'string', example: '66aa11223344556677889904' },
                  driverId: { type: 'string', example: '66aa11223344556677889903' },
                  departureTime: { type: 'string', format: 'date-time', example: '2026-08-10T10:00:00.000Z' },
                  arrivalTime: { type: 'string', format: 'date-time', example: '2026-08-10T13:00:00.000Z' },
                  price: { type: 'number', example: 150 },
                  capacity: { type: 'number', example: 50 },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Trip created' } },
      },
    },
    '/trips/{id}': {
      get: {
        tags: ['Trips'],
        summary: 'Get trip by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Trip details' } },
      },
      patch: {
        tags: ['Trips'],
        summary: 'Update trip details or status (Driver/Dispatcher/Admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', enum: ['scheduled', 'inProgress', 'completed', 'cancelled'], example: 'inProgress' },
                  price: { type: 'number', example: 160 },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Trip updated' } },
      },
      delete: {
        tags: ['Trips'],
        summary: 'Delete trip (Admin/Dispatcher)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Trip deleted' } },
      },
    },
    '/bookings': {
      post: {
        tags: ['Bookings'],
        summary: 'Book seats on a trip (Passenger)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['tripId', 'passengers', 'paymentMethod'],
                properties: {
                  tripId: { type: 'string', example: '66aa11223344556677889905' },
                  passengers: { type: 'integer', example: 2 },
                  paymentMethod: { type: 'string', enum: ['cash', 'card', 'wallet'], example: 'cash' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Booking confirmed' } },
      },
    },
    '/bookings/my-bookings': {
      get: {
        tags: ['Bookings'],
        summary: 'Get current user bookings',
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'List of user bookings' } },
      },
    },
    '/bookings/{id}/cancel': {
      patch: {
        tags: ['Bookings'],
        summary: 'Cancel booking (Owner/Admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Booking cancelled' } },
      },
    },
    '/reviews': {
      get: {
        tags: ['Reviews'],
        summary: 'Get all reviews',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'tripId', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'List of reviews' } },
      },
      post: {
        tags: ['Reviews'],
        summary: 'Add review for a trip',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['tripId', 'rating'],
                properties: {
                  tripId: { type: 'string', example: '66aa11223344556677889905' },
                  rating: { type: 'number', minimum: 1, maximum: 5, example: 5 },
                  comment: { type: 'string', example: 'Great trip!' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Review added' } },
      },
    },
    '/reviews/{id}': {
      get: {
        tags: ['Reviews'],
        summary: 'Get review by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Review details' } },
      },
      patch: {
        tags: ['Reviews'],
        summary: 'Update review (Owner/Admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Review updated' } },
      },
      delete: {
        tags: ['Reviews'],
        summary: 'Delete review (Owner/Admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Review deleted' } },
      },
    },
  },
};

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('📖 Swagger Documentation UI is available at http://localhost:3000/api-docs');
};

module.exports = setupSwagger;
