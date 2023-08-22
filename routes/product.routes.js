const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");

router.post("/create", (req, res, next) => {
  const { title, description, images, author, price, quantity, categories } =
    req.body;

  const newProduct = {
    title,
    description,
    images,
    author,
    price,
    quantity,
    categories,
  };
  Product.create(newProduct)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((err) => console.log(err));
});

router.get("/single/:projectId", (req, res, next) => {
  const { projectId } = req.params;
  Product.findById(projectId)
    .then((response) => {
      if (response) {
        res.status(200).json(response);
      }
      res.status(404).json({ message: "Product not found" });
    })
    .catch((err) => console.log(err));
});

router.get("/all", (req, res, next) => {
  Product.find()
    .then((response) => {
      console.log(response);
      res.status(200).json(response)
    })
    .catch((err) => console.log(err));
});

router.put("/edit/:projectId", (req, res, next) => {
  const { title, description, images, price, quantity, categories } = req.body;
  const { projectId } = req.params;
  Product.findByIdAndUpdate(
    { _id: projectId },
    {
      title,
      description,
      images,
      price,
      quantity,
      categories,
    },
    { new: true }
  )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => console.log(err));
});

router.post("/delete/:projectId", (req, res, next) => {
  const { projectId } = req.params;
  Product.findByIdAndDelete(projectId).then((response) => {
    if (response) {
      res.status(200).json({ message: "Successfully deleted product" });
    }
    res.status(400).json({ message: "Product not found" });
  });
});

module.exports = router;
