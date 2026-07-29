const Review = require("../Model/Review");

function AddReview (req, res) {
  //--2-logic
    const dataREQ = req.body;
    // req.param.id
    console.log(dataREQ); //js {}

  
    Review.create(dataREQ)
    .then(() => {
      res.status(201).json({ msg: "Review added successfully", data: dataREQ });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Review not added , try again");
    });
}
const getReview = (req, res) => {
  Review
    .find()
    .then((review) => {
      res.status(200).json({ msg: "Review fetched successfully", data: review });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Review not fetched, try again");
    });
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(    // use this  method  to update   and  return updated  object    
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!review) {
      return res.status(404).json({
        msg: "Review not found",
      });
    }

    res.status(200).json({
      msg: "Review updated successfully",
      data: review,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Failed to update review",
    });
  }
};


const getReviewById = (req, res) => {
  const { id } = req.params;

  Review
    .findById(id)
    .then((review) => {
      if (!review) {
        return res.status(404).json({
          msg: "Review not found",
        });
      }

      res.status(200).json({
        msg: "Review fetched successfully",
        data: review,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        msg: "Failed to fetch review",
      });
    });
};
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        msg: "Review not found",
      });
    }

    res.status(200).json({
      msg: "Review deleted successfully",
      data: review,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Failed to delete review",
    });
  }
};
module.exports = {
  AddReview,
  getReview,
  getReviewById,
  updateReview,
  deleteReview,
};