const express = require("express");
const router = express.Router();
const fileUploader = require('../config/cloudinary.config')

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.post('/upload', fileUploader.single("imageUrl"), (req, res, next) => {
  if (!req.file) {
    return res.status(404).json({ message: "no file uploaded" })
  }

  return res.json({ fileUrl: req.file.path })
})

module.exports = router;
