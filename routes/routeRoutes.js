const express = require("express");

const {
    createRoute,
    getAllRoutes,
    getRouteById,
    updateRoute,
    deleteRoute,
} = require("../controllers/routeController");

const router = express.Router();

router.post("/", createRoute);
router.get("/", getAllRoutes);
router.get("/:id", getRouteById);
router.patch("/:id", updateRoute);
router.delete("/:id", deleteRoute);

module.exports = router;