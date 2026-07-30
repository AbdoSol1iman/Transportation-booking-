const Vehicle = require("../Model/Vehicle");


const createVehicle = (req,res)=>{
    Vehicle.create(req.body).then((vehicles)=>{
      res.status(201).json({
         message: "Vehicle created successfully",
      });
    }).catch((err) => {
    res.status(500).json({
        message: err.message
    });
});
};

const getAllVehicles = (req, res) => {
Vehicle.find().then((vehicles)=>{
res.status(200).json(vehicles);
}).catch((err=>{res.status(500).json({
        message: err.message
    });
}))
};

const getVehicleById = (req,res)=>{
     Vehicle.findById(req.params.id).then((vehicle) => {
    if (!vehicle) {
        return res.status(404).json({
            message: "Vehicle not found"
        });
    }

    res.status(200).json(vehicle);
}).catch((err=>{res.status(500).json({
        message: err.message
    });
}))
};
const updateVehicle = (req, res) => {
    Vehicle.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
    .then((vehicle) => {

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            message: "Vehicle updated successfully",
            vehicle
        });

    })
    .catch((err) => {
        res.status(500).json({
            message: err.message
        });
    });
};
const deleteVehicle = (req, res) => {
    Vehicle.findByIdAndDelete(req.params.id)
        .then((vehicle) => {

            if (!vehicle) {
                return res.status(404).json({
                    message: "Vehicle not found"
                });
            }

            res.status(200).json({
                message: "Vehicle deleted successfully"
            });

        })
        .catch((err) => {
            res.status(500).json({
                message: err.message
            });
        });
};

module.exports={createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle};