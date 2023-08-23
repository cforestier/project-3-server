const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Review = require("../models/Review.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/create/:targetId", isAuthenticated, async (req, res, next) => {
  const { targetId } = req.params;
  const { review, comment } = req.body;
  const currentUser = req.payload;

  try {
    const newReview = await Review.create({
      reviewTarget: targetId,
      review,
      comment,
      author: currentUser._id,
    });
    const updatedUser = await User.findByIdAndUpdate(targetId, {
      $push: { reviews: newReview._id },
    });

    res.status(200).json({ newReview, message: "review Created Successfully" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/delete/:reviewId", async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    const user = await User.findById(review.reviewTarget);

    user.reviews.pull(reviewId);
    await user.save();
    await review.deleteOne();

    return res.json({ message: "review deleted successfully" });
  } catch (err) {
    console.log(err);
  }
});

router.put("/edit/:reviewId", (req, res, next) => {
  const { reviewId } = req.params;
  console.log(req.body);

  Review.findByIdAndUpdate(reviewId, req.body).then((updatedReview) => {
    res
      .status(200)
      .json({ updatedReview, message: "review edited successfully" });
  });
});

router.get("/all/:userId", (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .populate("reviews")
    .then((response) => {
        if (response.reviews.length > 0) {
            res.status(200).json(response.reviews);
        }
        else {
            res.status(404).json({message: "No reviews yet"})
        }
    });
});

router.get('/single/:reviewId', (req, res, next) => {
    const { reviewId } = req.params;
    Review.findById(reviewId)
        .then((response) => {
            if (response) {
                res.status(200).json({ response })
            }
            else {
                res.status(400).json({ message: "could not find that review"})
            }
        }) 
})

module.exports = router;
