const Route = require("../Model/Route");


const createRoute = async (req, res) => {
    try {
        console.log("BODY:", req.body);

        const route = await Route.create(req.body);

        console.log("CREATED:", route);

        res.status(201).json({
            message: "Route created successfully",
            route
        });

    } catch (err) {
        console.error("FULL ERROR:");
        console.error(err);

        res.status(500).json({
            message: err.message
        });
    }
};
const getAllRoutes = (req, res) => {
    Route.find()
        .populate("startStationId")
        .populate("endStationId")
        .then((routes) => {
            res.status(200).json(routes);
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
            });
        });
};

const getRouteById = (req, res) => {
    Route.findById(req.params.id)
        .populate("startStationId")
        .populate("endStationId")
        .then((route) => {
            if (!route) {
                return res.status(404).json({
                    message: "Route not found",
                });
            }

            res.status(200).json(route);
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
            });
        });
};

const updateRoute = (req, res) => {
    Route.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((route) => {
            if (!route) {
                return res.status(404).json({
                    message: "Route not found",
                });
            }

            res.status(200).json({
                message: "Route updated successfully",
                route,
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
            });
        });
};

const deleteRoute = (req, res) => {
    Route.findByIdAndDelete(req.params.id)
        .then((route) => {
            if (!route) {
                return res.status(404).json({
                    message: "Route not found",
                });
            }

            res.status(200).json({
                message: "Route deleted successfully",
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
            });
        });
};

module.exports = {
    createRoute,
    getAllRoutes,
    getRouteById,
    updateRoute,
    deleteRoute,
};