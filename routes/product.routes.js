const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");

router.post("/create", isAuthenticated, async (req, res, next) => {
  const user = req.payload;
  const { title, description, images, price, quantity, categories, wear, brand } = req.body;
  // creates a product using the req.body & the req.payload(user)
  // (title, description, images, price, quantity, categories)
  try {
    const newProduct = await Product.create({
      title,
      description,
      images,
      author: user._id,
      price,
      quantity,
      categories,
      wear,
      brand
    });
    // adds the new product to the products array of the creator of the product
    await User.findByIdAndUpdate(user._id, {
      $push: { products: newProduct._id },
    });

    return res.status(201).json({ message: "Product created", newProduct });
  } catch (err) {
    console.log(err);
  }
});

router.get("/single/:productId", (req, res, next) => {
  // gets the product ID from the params
  const { productId } = req.params;
  // finds the product via it's ID
  Product.findById(productId)
  .populate("author")
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
  .populate("author")
    .then((allProducts) => {

      // if there are any products in the database it returns that to the front end
      if (allProducts.length > 0) {
        return res.status(200).json(allProducts);
      }
      // if there are no products in the database it sends back a message and a 404 status
      return res.status(200).json({ message: "There are no products" });
    })
    .catch((err) => console.log(err));
});

router.put("/edit/:productId", (req, res, next) => {
  // gets the productId ID from the params
  const { productId } = req.params;
  //******************************************************************************
  //  THIS MIGHT HAVE TO GET CHANGED, NOT SURE HOW THE IMAGES ARE GOING TO BEHAVE
  //******************************************************************************
  // finds the product and updates it with the req.body
  Product.findByIdAndUpdate({ _id: productId }, req.body, { new: true })
    .then((response) => {
      // if no product can be found with the id it will send back a message
      if (!response) {
        return res.status(400).json({ message: "Product not found" });
      }
      // if it can find one it updates it and sends it to the front end as updatedProduct and with a message
      return res.status(200).json({
        updatedProduct: response,
        message: "Product updated successfully",
      });
    })
    .catch((err) => console.log(err));
});

router.post("/delete/:productId", async (req, res, next) => {
  // gets the productId from params
  const { productId } = req.params;
  try {
    // finds the product and if it cant be found returns a message
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }
    // if there is a product it will find the author of the product
    const user = await User.findById(product.author);

    // removes the product from the author array
    user.products.pull(productId);
    await user.save();

    // deletes the product from the database
    await product.deleteOne();

    // returns a message to the front end
    return res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/:productId/like", isAuthenticated,  async (req, res) => {
  
  const productId = req.params.productId;
  const loggedUser = req.payload;

  try {
    const product = await Product.findById(productId);
    const user = await User.findById(loggedUser._id);
    // const user = await User.findById(userId);


    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const likedIndex = product.likes.indexOf(loggedUser._id);
    // const likedIndex = product.likes.indexOf(userId);

    if (!Array.isArray(user.productsLiked)) {
      user.productsLiked = [];
    }

    const productsLikedIndex = user.productsLiked.indexOf(product._id);

    if (likedIndex === -1 || undefined && productsLikedIndex === -1 || undefined) {
    
      // product.likes.push(userId);
      product.likes.push(loggedUser._id);
      user.productsLiked.push(product._id);
    } else {
      // User has already liked the product, so remove the like
      product.likes.splice(likedIndex, 1);
      user.productsLiked.splice(productsLikedIndex, 1);
    }

    await Promise.all([product.save(), user.save()]);

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
