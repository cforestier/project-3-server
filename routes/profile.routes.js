const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
  const { username, password } = req.body;

  if (password && username) {
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        return res
          .statusMessage(500)
          .json({ message: "Password hashing error" });
      }
      User.findByIdAndUpdate(
        user._id,
        { username, password: hashedPassword },
        { new: true }
      ).then((foundUser) => {
        const { username } = foundUser;
        return res.status(200).json({ username });
      });
    });
  } else if (password) {
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: "Password hashing error" });
      }

      User.findByIdAndUpdate(
        user._id,
        { password: hashedPassword },
        { new: true }
      ).then((foundUser) => {
        const { username } = foundUser;
        return res.status(200).json({ username });
      });
    });
  } else if (username) {
    User.findOne({ username }).then((foundUser) => {
      if (foundUser) {
        return res.json({ message: "Username taken" });
      } else {
        User.findByIdAndUpdate(user._id, { username }, { new: true }).then(
          (foundUser) => {
            const { username } = foundUser;
            // new user object that we will return to front end
            return res.status(200).json({ username });
          }
        );
      }
    });
  }
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
