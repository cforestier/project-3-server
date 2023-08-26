const express = require("express");
const router = express.Router();
const fileUploader = require('../config/cloudinary.config')

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.post('/upload', fileUploader.single("imageUrl"), (req, res, next) => {
  // if there is no file, returns with a message
  if (!req.file) {
    return res.json({ message: "no file added" })
  }
  // if there is a file it uploads it and returns the image url and a message
  return res.json({ fileUrl: req.file.path, message: "image uploaded" })
})

module.exports = router;
