const Station = require("../Model/Station");

const createStation = async (req, res) => {
    try {
        console.log("BODY:", req.body);

        const station = await Station.create(req.body);

        console.log("CREATED:", station);

        res.status(201).json({
            message: "Station created successfully",
            station
        });

    } catch (err) {
        console.error("FULL ERROR:");
        console.error(err);

        res.status(500).json({
            message: err.message
        });
    }
};

const getAllStations = (req, res) => {
    Station.find()
        .then((stations) => {
            res.status(200).json(stations);
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
            });
        });
};

const getStationById = (req, res) => {
    Station.findById(req.params.id)
        .then((station) => {
            if (!station) {
                return res.status(404).json({
                    message: "Station not found",
                });
            }

            res.status(200).json(station);
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
            });
        });
};

const updateStation = (req, res) => {
    Station.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((station) => {
            if (!station) {
                return res.status(404).json({
                    message: "Station not found",
                });
            }

            res.status(200).json({
                message: "Station updated successfully",
                station,
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
            });
        });
};

const deleteStation = (req, res) => {
    Station.findByIdAndDelete(req.params.id)
        .then((station) => {
            if (!station) {
                return res.status(404).json({
                    message: "Station not found",
                });
            }

            res.status(200).json({
                message: "Station deleted successfully",
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message,
            });
        });
};

module.exports = {
    createStation,
    getAllStations,
    getStationById,
    updateStation,
    deleteStation,
};