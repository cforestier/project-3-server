const express = require("express");
const router = express.Router();
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model");

router.get("/:userId", (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId).populate('reviews')
  .then((foundUser) => {
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json({ foundUser, message: "User found" });
    }
  });
});

module.exports = router;
