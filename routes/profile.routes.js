const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/:userId", (req, res, next) => {
  // gets the userId from params
  const { userId } = req.params;
  // finds the user using the ID and populates the reviews & products arrays
  User.findById(userId)
    .populate("reviews")
    .populate("products")
    .then((foundUser) => {
      // if there is no user it will return a message
      if (!foundUser) {
        return res.json({ message: "User not found" });
      } else {
        // destructure the foundUser to only return relevant information (no password or timestamps)
        const { _id, email, username, reviews, roles, products, image } =
          foundUser;
        // new user object that we will return to front end
        const user = {
          _id,
          email,
          username,
          reviews,
          roles,
          products,
          image,
        };
        // returns the user and a message to the front end
        return res.status(200).json({ user, message: "User found" });
      }
    });
});

router.put("/edit/:userId", isAuthenticated, (req, res, next) => {
  const user = req.payload;
  const { username, image } = req.body;
  console.log(req.body)

  if (username.length < 5) return res.status(200).json({message: "username can not be less than 5 characters"})

  User.findOne({ username }).then((foundUser) => {
    if (foundUser) {
      return res.json({ message: "Username taken" });
    } else {
      User.findByIdAndUpdate(user._id, { username, image }, { new: true }).then(
        (foundUser) => {
          const { username, image } = foundUser;
          // new user object that we will return to front end
          return res.status(200).json({ username, image });
        }
      );
    }
  });
});

router.put("/edit/:userId/image", isAuthenticated, (req, res, next) => {
  const user = req.payload;
  const { image } = req.body;
  User.findByIdAndUpdate(user._id, { image }, { new: true }).then(
    (editedUser) => {
      res.json({ image: editedUser.image, message: "Avatar changed" });
    }
  );
});

module.exports = router;
