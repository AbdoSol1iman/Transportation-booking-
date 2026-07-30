const express = require("express");
const reviewRoutes = require("./routes/review.routes");
const mongoose = require("mongoose");
const vehicleRoutes = require("./routes/vehiclesRoutes");
const app = express();
app.use(express.json());
app.use("/reviews", reviewRoutes);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/vehicles", vehicleRoutes);
const MONGO_URI =
  "mongodb://ahmedemad:MCCNMVcBnFH28uq0@ac-1kq2nt9-shard-00-00.sinmsue.mongodb.net:27017,ac-1kq2nt9-shard-00-01.sinmsue.mongodb.net:27017,ac-1kq2nt9-shard-00-02.sinmsue.mongodb.net:27017/TransportationProject?ssl=true&replicaSet=atlas-6zxqi3-shard-0&authSource=admin";

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