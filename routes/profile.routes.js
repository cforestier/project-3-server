const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/single/:userId", (req, res, next) => {
  // gets the userId from params
  const { userId } = req.params;
  // finds the user using the ID and populates the reviews & products arrays
  User.findById(userId)
    .populate("productsLiked")
    .populate({
      path: "reviews",
      populate: {
        path: "author",
        select: "username image"
      }
    })
    .populate("products")
    .then((foundUser) => {
      // if there is no user it will return a message
      if (!foundUser) {
        return res.json({ message: "User not found" });
      } else {
        // destructure the foundUser to only return relevant information (no password or timestamps)
        const {
          _id,
          email,
          username,
          reviews,
          roles,
          products,
          image,
          productsLiked,
        } = foundUser;
        // new user object that we will return to front end
        const user = {
          _id,
          email,
          username,
          reviews,
          roles,
          products,
          image,
          productsLiked,
        };
        // returns the user and a message to the front end
        return res.status(200).json({ user, message: "User found" });
      }
    });
});

router.put("/edit/:userId/info", isAuthenticated, async (req, res, next) => {
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  const user = req.payload;
  const { username, password, currentPassword } = req.body;
  const { email } = user;
  try {
    const foundUser = await User.findOne({ email });
    if (password) {
      const correctPassword = bcrypt.compareSync(
        currentPassword,
        foundUser.password
      );
      if (!correctPassword) {
        return res.json({ errorMessage: "Invalid current password provided" });
      } else if (!passwordRegex.test(password)) {
        res.json({
          errorMessage:
            "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
        });
      } else if (correctPassword && currentPassword === password) {
        return res.json({
          errorMessage: "Can not change to the same password",
        });
      } else {
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        await User.findOneAndUpdate(
          { email },
          { password: hashedPassword },
          { new: true }
        );
        res.json({ message: "changed password" });
      }
    } else if (username) {
      const foundUsername = await User.findOne({ username });
      if (foundUsername) {
        return res.json({ message: "Username taken" });
      } else {
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          { username },
          { new: true }
        );
        return res.json({ username: updatedUser.username });
      }
    }
  } catch (err) {
    console.log(err);
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
