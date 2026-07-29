const express = require("express");
const reviewRoutes = require("./routes/review.routes");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/reviews", reviewRoutes);
const port = process.env.PORT || 3000;

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