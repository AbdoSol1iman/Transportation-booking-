const express = require("express");

const {
    createStation,
    getAllStations,
    getStationById,
    updateStation,
    deleteStation,
} = require("../controllers/stationController");

const router = express.Router();

router.post("/", createStation);
router.get("/", getAllStations);
router.get("/:id", getStationById);
router.patch("/:id", updateStation);
router.delete("/:id", deleteStation);

module.exports = router;