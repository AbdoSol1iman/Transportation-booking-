const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const reviewRoutes = require("./routes/review.routes");
const vehicleRoutes = require("./routes/vehiclesRoutes");

const app = express();
app.use(express.json());
app.use("/reviews", reviewRoutes);
app.use("/vehicles", vehicleRoutes);
const port = process.env.PORT ;


const MONGO_URI = process.env.MONGO_URI;



mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(" Connected to MongoDB");
  })
  .catch((err) => {
    console.error(" MongoDB Connection Error:");
    console.error(err);
  });

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
