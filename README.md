# Transportation Project

This project is a transportation management backend built with Node.js and Express.

## Features
- User management
- Driver management
- Trip and booking management
- Review handling
- Route and station management

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose

## Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your environment variables
4. Start the server:
   ```bash
   node index.js
   ```

## Environment Variables
Create a `.env` file with the following variables:

```env
PORT=3000
SECRET_KEY=your_secret_key_here
API_KEY=your_api_key_here
```

## Project Structure
- `controllers/` - Request handlers
- `middleware/` - Custom middleware
- `Model/` - Mongoose models
- `routes/` - API routes
- `index.js` - Entry point

## Notes
Make sure to keep sensitive values such as API keys and secret keys in the `.env` file and do not share them publicly.

```
Transportation-booking-
├─ Model
│  ├─ Booking.js
│  ├─ Driver.js
│  ├─ Review.js
│  ├─ Route.js
│  ├─ Station.js
│  ├─ Trip.js
│  ├─ User.js
│  └─ Vehicle.js
├─ README.md
├─ controllers
│  └─ user.js
├─ index.js
├─ middleware
│  └─ CORS.js
├─ package-lock.json
├─ package.json
└─ routes
   └─ user.js

```