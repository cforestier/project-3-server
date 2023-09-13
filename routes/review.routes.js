const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Review = require("../models/Review.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/create/:targetId", isAuthenticated, async (req, res, next) => {
  // gets the targetId from the params
  const { targetId } = req.params;
  // review (number) & comment (string) from req.body
  const { review, comment } = req.body;
  // current user from the payload (token)
  const currentUser = req.payload;

  try {
    // creates a new review with the info above
    const newReview = await Review.create({
      reviewTarget: targetId,
      review,
      comment,
      author: currentUser._id,
    });
    // finds the target user that is GETTING a review and pushes that review to the review array of that user
    await User.findByIdAndUpdate(targetId, {
      $push: { reviews: newReview._id },
    });
    const populateNewReview = await Review.findById(newReview._id).populate(
      "author"
    );
    // returns a message and the new review if successful
    return res
      .status(200)
      .json({
        newReview: populateNewReview,
        message: "review Created Successfully",
      });
  } catch (err) {
    console.log(err);
    // if there's an error it will send this message instead
    return res.status(400).json({ message: "Something went terribly wrong" });
  }
});

router.post("/delete/:reviewId", async (req, res, next) => {
  try {
    // gets the review ID from the params
    const { reviewId } = req.params;

    // finds the review
    const review = await Review.findById(reviewId);
    // finds the TARGET of the review
    const user = await User.findById(review.reviewTarget);

    // removes the review from the TARGET user and saves the changes to the user
    user.reviews.pull(reviewId);
    await user.save();
    // deletes the review
    await review.deleteOne();

    // returns a message
    return res.json({ message: "review deleted successfully" });
  } catch (err) {
    console.log(err);
    // if there's an error it will send this message instead
    return res.status(400).json({ message: "Something went terribly wrong" });
  }
});

router.put("/edit/:reviewId", async (req, res, next) => {
  // gets the review ID from the params
  const { reviewId } = req.params;

  // finds the review and updates it using the req.body (review, comment)
  const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, {
    new: true,
  });
  if (!updatedReview) {
    return res.status(400).json({ message: "Review not found" });
  } else {
    const populatedReview = await Review.findById(updatedReview._id).populate(
      "author"
    );
    return res
      .status(200)
      .json({
        updatedReview: populatedReview,
        message: "review edited successfully",
      });
  }
});

router.get("/all/:userId", (req, res, next) => {
  // can be used on a profile page to access all reviews associated with the user
  // gets the userId
  const { userId } = req.params;
  // finds the user
  User.findById(userId)
    .populate("reviews")
    .then((foundUser) => {
      // if there are any reviews in the array it will return the reviews to the front end
      if (foundUser.reviews.length > 0) {
        return res.status(200).json({ reviews: foundUser.reviews });
      }
      // if no reviews are present in the array it returns a message
      else {
        return res.status(404).json({ message: "No reviews yet" });
      }
    });
});

router.get("/single/:reviewId", (req, res, next) => {
  // can be used to edit a review
  // gets the reviewId from req.params
  const { reviewId } = req.params;
  // tries to find the id and returns it to the front end
  Review.findById(reviewId).then((foundReview) => {
    if (foundReview) {
      res.status(200).json({ foundReview });
    }
    // if the review cant be found it returns a message
    else {
      res.status(400).json({ message: "Review not found" });
    }
  });
});

module.exports = router;
