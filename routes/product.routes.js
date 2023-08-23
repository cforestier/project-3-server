const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");

router.post("/create", (req, res, next) => {
  // creates a product using the req.body 
  // (title, description, images, price, quantity, categories)
  Product.create(req.body)
    .then((createdProduct) => {
      // sends the created product back to the front end
      res.status(201).json(createdProduct);
    })
    .catch((err) => console.log(err));
});

router.get("/single/:productId", (req, res, next) => {
  // gets the product ID from the params
  const { productId } = req.params;
  // finds the product via it's ID
  Product.findById(productId)
    .then((foundProduct) => {
      // if there is a product with that ID it sends back the product to the front end
      if (foundProduct) {
        return res.status(200).json(foundProduct);
      }
      // if there is not a product with that ID it sends back a message and a 404 status
      return res.status(404).json({ message: "Product not found" });
    })
    .catch((err) => console.log(err));
});

router.get("/all", (req, res, next) => {
  // finds all products in the database
  Product.find()
    .then((allProducts) => {
      // if there are any products in the database it returns that to the front end
      if (allProducts.length > 0) {
        return res.status(200).json(allProducts);
      } 
      // if there are no products in the database it sends back a message and a 404 status
      return res.status(404).json({ message: "There are no products" })
    })
    .catch((err) => console.log(err));
});

router.put("/edit/:productId", (req, res, next) => {
  // gets the productId ID from the params
  const { productId } = req.params;
//*****************************************************************************
//  THIS MIGHT HAVE TO GET CHANGED, NOT SURE HOW THE IMAGES ARE GOING TO BEHAVE
//*****************************************************************************
  // finds the product and updates it with the req.body
  Product.findByIdAndUpdate(
    { _id: productId },
    req.body,
    { new: true }
  )
    .then((response) => {
      // if no product can be found with the id it will send back a message
      if (!response) {
        return res.status(400).json({ message: "Product not found" })
      }
      // if it can find one it updates it and sends it to the front end as updatedProduct and with a message
      return res.status(200).json({updatedProduct: response, message: "Product updated successfully"});
    })
    .catch((err) => console.log(err));
});

router.post("/delete/:productId", (req, res, next) => {
  const { productId } = req.params;
  // finds a product by it's ID and deletes it
  Product.findByIdAndDelete(productId).then((response) => {
    // if there is a product with that id it will delete it and send a message ONLY
    if (response) {
      return res.status(200).json({ message: "Successfully deleted product" });
    }
    // if there is no product with that ID it will send back a message ONLY
    return res.status(400).json({ message: "Product not found" });
  });
});

module.exports = router;
