# 🚍 Transportation Booking & Management System

[![Node.js](https://img.shields.io/badge/node.js-v18%2B-brightgreen.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Angular](https://img.shields.io/badge/Angular-v24-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![Express.js](https://img.shields.io/badge/express.js-%23404D59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%2347A248.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-API_Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](http://localhost:3000/api-docs)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

> **NTI Graduation Project** — A full-stack transportation booking platform featuring a sleek dark-themed Angular frontend and a robust Node.js/Express REST API, connected to MongoDB. Passengers can browse trips, book seats, and rate their experience. Admins manage the entire fleet, routes, and scheduling.

---

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🔑 Role-Based Access Control](#-role-based-access-control-rbac)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [📖 API Documentation](#-api-documentation--swagger)
- [📡 API Routes Reference](#-api-routes-reference)
- [🎨 Frontend Pages](#-frontend-pages)
- [🛡️ Security](#️-security-features)
- [🧪 Postman Collection](#-postman-collection)
- [👥 Contributors](#-contributors)

---

## ✨ Key Features

### 🔐 Authentication & Security
- **JWT Authentication** — stateless, token-based login
- **Role-Based Access Control (RBAC)** — 4 roles: `admin`, `dispatcher`, `driver`, `passenger`
- **Password Hashing** — `bcryptjs`
- **Input Validation** — `Zod` schema validation on all endpoints
- **HTTP Security** — `helmet`, `cors`, `express-rate-limit`

### 🚏 Stations & Routes
- Full CRUD for transit stations with city & location data
- Route management connecting origin ↔ destination stations
- Distance, duration, and base fare configuration

### 🚍 Fleet & Driver Management
- Manage vehicle fleet (model, plate, capacity, type)
- Driver assignment with license tracking and ratings

### 📅 Trip Scheduling
- Schedule trips with departure/arrival times, pricing, seat capacity
- Dynamic status tracking: `scheduled` → `inProgress` → `completed` / `cancelled` / `fullyBooked`
- **Auto-Close Background Job** — runs every 60 seconds:
  - Marks trips as `completed` when departure time passes
  - Marks trips as `fullyBooked` when all seats are taken
- Real-time available seat tracking with progress indicators

### 🎟️ Seat Booking
- Passengers browse and book seats with MongoDB transactions (atomic operations)
- Instant trip lock when seats fill up (no race conditions)
- Booking history, cancellation support, and booking codes
- Prevents booking on expired or full trips with descriptive Arabic error messages

### ⭐ Reviews & Ratings
- Passengers rate completed trips with 1–5 stars and optional comments
- Per-trip reviews lazy-loaded in an accordion on the trip list
- Average rating displayed per trip
- One review per user per trip (enforced on backend)

### 🎨 Modern Frontend (Angular 17)
- Dark-themed UI with neon lime (`#c3f400`) accent system
- Responsive design (mobile-first with TailwindCSS)
- Standalone components with Angular signals-ready architecture
- Smart trip cards: status badges, lock overlays, booking controls
- Rich trip detail page with timeline, seat progress bar, driver card

---

## 🛠️ Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js v18+ |
| Framework | Express.js |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT + bcryptjs |
| Validation | Zod |
| Security | helmet, cors, express-rate-limit |
| API Docs | swagger-ui-express |
| Background Jobs | Native `setInterval` (no external cron) |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | Angular 17 (Standalone Components) |
| Styling | TailwindCSS v3 + Custom CSS Variables |
| HTTP | Angular HttpClient + Interceptors |
| State | Component-level with ChangeDetectorRef |
| Icons | Google Material Symbols |
| Fonts | Cairo (Arabic) + Mono |

---

## 🔑 Role-Based Access Control (RBAC)

| Role | Description | Key Permissions |
| :--- | :--- | :--- |
| **👑 Admin** | Full system control | All CRUD — users, drivers, routes, trips, bookings, reviews |
| **🕹️ Dispatcher** | Operations manager | Stations, routes, vehicles, drivers, trip scheduling |
| **🚚 Driver** | Vehicle operator | View assigned trips, update trip status |
| **🧑‍💼 Passenger** | End customer | Browse trips, book seats, cancel bookings, submit reviews |

---

## 📁 Project Structure

```
Transportation-booking-/
│
├── Backend/
│   ├── config/
│   │   ├── roles.js               # Permission definitions per role
│   │   └── swagger.js             # Swagger/OpenAPI configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js   # Atomic booking + auto-lock on full
│   │   ├── driverController.js
│   │   ├── routeController.js
│   │   ├── stationController.js
│   │   ├── trip.js
│   │   ├── user.js
│   │   ├── vehiclesController.js
│   │   └── Reviews.js
│   ├── middleware/
│   │   ├── auth.js                # JWT verify + role protection
│   │   ├── validate.js            # Zod schema middleware
│   │   └── errorHandler.js        # Centralized error responses
│   ├── Model/
│   │   ├── User.js
│   │   ├── Driver.js
│   │   ├── Vehicle.js
│   │   ├── Station.js
│   │   ├── Route.js
│   │   ├── Trip.js                # status: scheduled|inProgress|completed|cancelled|fullyBooked
│   │   ├── Booking.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── driverRoutes.js
│   │   ├── routeRoutes.js
│   │   ├── stationRoutes.js
│   │   ├── trip.js
│   │   ├── user.js
│   │   ├── vehiclesRoutes.js
│   │   └── review.routes.js
│   ├── utils/
│   │   ├── AppError.js
│   │   ├── catchAsync.js
│   │   └── autoCloseTrips.js      # Background job: auto-close trips
│   ├── validations/
│   │   └── schemas.js
│   ├── scripts/
│   │   └── seedAdmin.js
│   ├── index.js
│   └── package.json
│
├── FrontEnd/
│   └── src/
│       ├── app/
│       │   ├── core/
│       │   │   ├── guards/        # auth.guard, role.guard
│       │   │   ├── interceptors/  # auth.interceptor (JWT header)
│       │   │   ├── models/        # Trip, Booking, User, Review...
│       │   │   └── services/      # trip, booking, review, auth...
│       │   ├── features/
│       │   │   ├── auth/          # Login, Register
│       │   │   ├── home/          # Landing page with trip cards
│       │   │   ├── trips/
│       │   │   │   ├── trip-list/ # Filter sidebar, reviews accordion
│       │   │   │   └── trip-detail/ # Timeline, seats, driver, booking
│       │   │   ├── bookings/      # Booking form & history
│       │   │   ├── dashboard/     # Admin overview
│       │   │   ├── drivers/
│       │   │   ├── stations/
│       │   │   ├── routes/
│       │   │   ├── vehicles/
│       │   │   ├── users/
│       │   │   └── reviews/
│       │   └── shared/
│       │       └── components/    # Navbar, Footer
│       ├── environments/
│       └── styles.css
│
├── Transportation_API_Postman_Collection.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/) (local or Atlas URI)
- [Git](https://git-scm.com/)

### 1. Clone the repository

```bash
git clone https://github.com/AbdoSol1iman/Transportation-booking-.git
cd Transportation-booking-
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/transportation_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
```

Seed a default admin account:

```bash
npm run seed:admin
```

Start the backend server:

```bash
npm start
# Server: http://localhost:3000
# Swagger: http://localhost:3000/api-docs
```

### 3. Frontend Setup

```bash
cd FrontEnd
npm install
npm start
# App: http://localhost:4200
```

---

## 📖 API Documentation & Swagger

Interactive Swagger UI is available when the backend is running:

🔗 **`http://localhost:3000/api-docs`**

Explore all endpoints, view request/response schemas, and test with JWT Bearer auth directly from the browser.

---

## 📡 API Routes Reference

### Auth
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register new user |
| `POST` | `/api/v1/auth/login` | Public | Login & receive JWT |

### Trips
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/trips` | Public | List all trips (with filters) |
| `GET` | `/api/v1/trips/:id` | Public | Get trip details |
| `POST` | `/api/v1/trips` | Admin | Schedule a new trip |
| `PATCH` | `/api/v1/trips/:id` | Admin | Update trip |
| `DELETE` | `/api/v1/trips/:id` | Admin | Delete trip |

### Bookings
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/bookings` | Passenger | Book seats (atomic, race-condition safe) |
| `GET` | `/api/v1/bookings/my-bookings` | Passenger | View booking history |
| `PATCH` | `/api/v1/bookings/:id/cancel` | Passenger / Admin | Cancel booking |

### Reviews
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/reviews` | Public | List all reviews |
| `GET` | `/api/v1/reviews?tripId=:id` | Public | Reviews for a specific trip |
| `POST` | `/api/v1/reviews` | Passenger | Submit a review (1 per trip) |
| `PATCH` | `/api/v1/reviews/:id` | Owner / Admin | Edit review |
| `DELETE` | `/api/v1/reviews/:id` | Owner / Admin | Delete review |

### Other Resources
| Resource | Endpoints |
| :--- | :--- |
| Users | `GET /api/v1/users`, `GET /api/v1/users/me` |
| Stations | `GET/POST/PATCH/DELETE /api/v1/stations` |
| Routes | `GET/POST/PATCH/DELETE /api/v1/routes` |
| Vehicles | `GET/POST/PATCH/DELETE /api/v1/vehicles` |
| Drivers | `GET/POST/PATCH/DELETE /api/v1/drivers` |

---

## 🎨 Frontend Pages

| Page | Route | Description |
| :--- | :--- | :--- |
| Home | `/` | Landing with featured trips |
| Trips | `/trips` | Filterable trip list (station, time, date, price, vibe) |
| Trip Detail | `/trips/:id` | Full trip info, seat counter, booking |
| Book | `/book` | Booking form with payment |
| My Bookings | `/bookings` | Personal booking history & cancellation |
| Login | `/login` | JWT auth login |
| Register | `/register` | New user registration |
| Dashboard | `/dashboard` | Admin overview |
| Stations | `/stations` | Station management (Admin) |
| Routes | `/routes` | Route management (Admin) |
| Vehicles | `/vehicles` | Fleet management (Admin) |
| Drivers | `/drivers` | Driver management (Admin) |
| Users | `/users` | User management (Admin) |
| Reviews | `/reviews` | Reviews management (Admin) |

---

## 🛡️ Security Features

| Feature | Implementation |
| :--- | :--- |
| **Rate Limiting** | 10,000 req / 15 min per IP (dev) |
| **HTTP Headers** | `helmet` middleware |
| **Payload Size Limit** | JSON body capped at `10kb` |
| **JWT Verification** | Every protected route uses `protect` middleware |
| **Atomic Bookings** | MongoDB sessions/transactions prevent double-booking |
| **Input Sanitization** | Zod schemas validate all incoming request bodies |
| **Centralized Errors** | `AppError` + `catchAsync` pattern |

---

## 🧪 Postman Collection

The repository includes a ready-to-use Postman collection:

- 📄 [`Transportation_API_Postman_Collection.json`](./Transportation_API_Postman_Collection.json)
- 📄 [`requests_examples.json`](./requests_examples.json)

**How to use:**
1. Open Postman → **Import**
2. Select `Transportation_API_Postman_Collection.json`
3. Set environment variable `{{baseUrl}}` → `http://localhost:3000`
4. Login first to get your JWT, then set `{{token}}`

---

## 👥 Contributors

Thanks to the NTI project team!

| Name | GitHub |
| :--- | :--- |
| Osama Matter | [@Osama-matter](https://github.com/Osama-matter) |
| Mohamed Omara | [@mohamadomara0](https://github.com/mohamadomara0) |
| Ahmed Emad | [@ahmed1emad12](https://github.com/ahmed1emad12) |
| Abdo Soliman | [@AbdoSol1iman](https://github.com/AbdoSol1iman) |

---

<p align="center">Made with ❤️ for NTI Transportation Project — 2026</p>
