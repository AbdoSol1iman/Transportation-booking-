# 🚍 Transportation Booking & Management System API

[![Node.js Version](https://img.shields.io/badge/node.js-v18%2B-brightgreen.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express.js-%23404D59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%2347A248.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)
[![Swagger Docs](https://img.shields.io/badge/Swagger-API_Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](http://localhost:3000/api-docs)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

> **NTI Project**: A robust, scalable, and secure RESTful API built for managing public/private transportation networks, trip scheduling, route dispatching, driver assignments, passenger seat bookings, and reviews.

---

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🔑 Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start Guide](#-quick-start-guide)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Admin Account Seeding](#admin-account-seeding)
  - [Running the Server](#running-the-server)
- [📖 API Documentation & Swagger](#-api-documentation--swagger)
- [📡 Main API Routes](#-main-api-routes)
- [🛡️ Security Features & Best Practices](#️-security-features--best-practices)
- [🧪 Postman Collection](#-postman-collection)
- [👥 Contributors](#-contributors)

---

## ✨ Key Features

### 🔐 1. Authentication & Security
- **JWT Authentication**: Secure token-based user login and stateless requests.
- **Granular RBAC**: Fine-grained permissions for 4 distinct roles (`admin`, `dispatcher`, `driver`, `passenger`).
- **Data Encryption**: Passwords hashed using `bcryptjs` before storage.
- **Input Validation**: Strict schema validation using `Zod` to sanitize incoming payloads.
- **Security Middleware**: Rate limiting with `express-rate-limit` and HTTP headers protection via `helmet`.

### 🚏 2. Stations & Routes Management
- Create, update, view, and delete transit stations with location coordinates.
- Configure routes connecting origin and destination stations.
- Compute distance, estimated duration, and base fares.

### 🚍 3. Fleet & Driver Management
- Manage vehicle fleets (capacity, plate number, vehicle model, status).
- Assign drivers to vehicles with license tracking and availability status.

### 📅 4. Trip Scheduling & Dispatching
- Schedule trips with defined departure/arrival times, pricing, and assigned vehicle/driver.
- Dynamic trip status tracking (`Scheduled`, `In-Transit`, `Completed`, `Cancelled`).
- Real-time available seat tracking.

### 🎟️ 5. Seat Booking System
- Passengers can search available trips and book seats.
- Automatic available seat decrement/increment upon booking/cancellation.
- Detailed booking history and ticket cancellation policies.

### ⭐ 6. Reviews & Ratings
- Passengers can leave ratings and comments for completed trips and drivers.
- Calculate average driver ratings.

---

## 🛠️ Tech Stack

- **Runtime Environment**: [Node.js](https://nodejs.org/)
- **Web Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: `jsonwebtoken` (JWT) & `bcryptjs`
- **Validation**: `Zod`
- **Security**: `helmet`, `cors`, `express-rate-limit`
- **API Documentation**: `swagger-ui-express`

---

## 🔑 Role-Based Access Control (RBAC)

The system enforces permission-based authorization across four roles:

| Role | Description | Key Permissions |
| :--- | :--- | :--- |
| **👑 Admin** | Full system control | All permissions (Manage users, drivers, routes, trips, bookings, reviews) |
| **🕹️ Dispatcher** | Fleet & Operations manager | Manage stations, routes, vehicles, drivers, schedule/update trips, manage bookings |
| **🚚 Driver** | Vehicle Operator | View assigned trips, update trip status (`In-Transit`, `Completed`) |
| **🧑‍💼 Passenger** | End Customer | Browse routes/trips, book seats, view/cancel own bookings, submit reviews |

---

## 📁 Project Structure

```bash
Transportation-Project/
├── Backend/
│   ├── config/               # Roles, permissions & Swagger specs
│   │   ├── roles.js
│   │   └── swagger.js
│   ├── controllers/          # Business logic handlers
│   │   ├── authController.js
│   │   ├── user.js
│   │   ├── bookingController.js
│   │   ├── driverController.js
│   │   ├── routeController.js
│   │   ├── stationController.js
│   │   ├── trip.js
│   │   ├── vehiclesController.js
│   │   └── Reviews.js
│   ├── middleware/           # Auth, RBAC, Validation & Error Handling
│   │   ├── auth.js
│   │   ├── validate.js
│   │   ├── CORS.js
│   │   └── errorHandler.js
│   ├── Model/                # Mongoose Schema Definitions
│   │   ├── User.js
│   │   ├── Driver.js
│   │   ├── Vehicle.js
│   │   ├── Station.js
│   │   ├── Route.js
│   │   ├── Trip.js
│   │   ├── Booking.js
│   │   └── Review.js
│   ├── routes/               # API Router endpoints
│   │   ├── authRoutes.js
│   │   ├── user.js
│   │   ├── bookingRoutes.js
│   │   ├── driverRoutes.js
│   │   ├── routeRoutes.js
│   │   ├── stationRoutes.js
│   │   ├── trip.js
│   │   ├── vehiclesRoutes.js
│   │   └── review.routes.js
│   ├── scripts/              # Database seeding scripts
│   │   └── seedAdmin.js
│   ├── utils/                # Custom error & async wrappers
│   │   ├── AppError.js
│   │   └── catchAsync.js
│   ├── validations/          # Zod schemas for input validation
│   │   └── schemas.js
│   ├── index.js              # Application entry point
│   └── package.json
├── FrontEnd/                 # Frontend client workspace (Coming soon)
├── Transportation_API_Postman_Collection.json
├── requests_examples.json
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas URI)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AbdoSol1iman/Transportation-booking-.git
   cd Transportation-booking-/Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the `Backend/` directory with the following variables:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/transportation_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
```

### Admin Account Seeding

To seed a default super-admin user in the database, run:

```bash
npm run seed:admin
```

---

### Running the Server

- **Development Mode (with Nodemon):**
  ```bash
  npm start
  ```

- **Production Mode:**
  ```bash
  node index.js
  ```

Server will start at: `http://localhost:3000`

---

## 📖 API Documentation & Swagger

Interactive Swagger UI documentation is available directly when running the application.

🔗 **Swagger URL:** `http://localhost:3000/api-docs`

You can explore endpoints, view schemas, and execute API calls with JWT Bearer authentication directly from the browser!

---

## 📡 Main API Routes

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register new passenger/driver |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user & get JWT token |
| `GET` | `/api/v1/users/me` | Authenticated | Get current logged-in profile |
| `GET` | `/api/v1/stations` | Public / Auth | List all transit stations |
| `POST` | `/api/v1/stations` | Admin / Dispatcher | Create a new station |
| `GET` | `/api/v1/routes` | Public / Auth | List available transportation routes |
| `POST` | `/api/v1/routes` | Admin / Dispatcher | Add a new route |
| `GET` | `/api/v1/trips` | Public / Auth | Search upcoming scheduled trips |
| `POST` | `/api/v1/trips` | Admin / Dispatcher | Schedule a new trip |
| `PATCH` | `/api/v1/trips/:id/status` | Driver / Dispatcher / Admin | Update trip status (`In-Transit`, `Completed`) |
| `POST` | `/api/v1/bookings` | Passenger | Reserve seat(s) on a trip |
| `GET` | `/api/v1/bookings/my-bookings` | Passenger | View personal booking history |
| `DELETE` | `/api/v1/bookings/:id` | Passenger / Admin | Cancel a booking |
| `POST` | `/api/v1/reviews` | Passenger | Post a trip/driver review |
| `GET` | `/api/v1/vehicles` | Dispatcher / Admin | Manage fleet vehicles |

---

## 🛡️ Security Features & Best Practices

- **Rate Limiting**: Protects against brute-force attacks by limiting requests to `100 requests / 15 minutes` per IP.
- **HTTP Headers Security**: Configured using `helmet` middleware.
- **Request Payload Sanitization**: JSON body size limited to `10kb` to prevent DoS memory overflow.
- **Centralized Error Handling**: Standardized response format for operational and validation errors using custom `AppError` handler.

---

## 🧪 Postman Collection

The repository includes a ready-to-use Postman Collection:
- 📄 File: [`Transportation_API_Postman_Collection.json`](./Transportation_API_Postman_Collection.json)
- 📄 Request Examples: [`requests_examples.json`](./requests_examples.json)

**How to use:**
1. Open Postman -> Click **Import**.
2. Select `Transportation_API_Postman_Collection.json`.
3. Set your environment variable `{{baseUrl}}` to `http://localhost:3000`.

---

## 👥 Contributors

Thanks to the NTI project team contributors!

- [Osama Matter](https://github.com/Osama-matter)
- [Mohamed Omara](https://github.com/mohamadomara0)
- [Ahmed Emad](https://github.com/ahmed1emad12)
- [Abdo Soliman](https://github.com/AbdoSol1iman)

---

<p align="center">Made with ❤️ for NTI Transportation Project</p>
