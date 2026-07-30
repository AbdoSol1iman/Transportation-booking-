const express = require("express");
const {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
} = require("../controllers/vehiclesController");

const router = express.Router();

router.post("/", createVehicle);
router.get("/",getAllVehicles);
router.get("/:id",getVehicleById);
router.patch("/:id",updateVehicle);
router.delete("/:id",deleteVehicle)
module.exports = router;