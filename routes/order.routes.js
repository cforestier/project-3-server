const express = require("express");
const router = express.Router();
const Order = require("../models/Order.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const Product = require("../models/Product.model");

router.post("/create", isAuthenticated, async (req, res, next) => {
  const user = req.payload;
  const { products, totalAmount } = req.body;

  try {
    const newOrder = await Order.create({
      products,
      customer: user._id,
      totalAmount,
    });

    await User.findByIdAndUpdate(user._id, {
      $push: { orders: newOrder._id },
    });

    products.forEach((product) => {
      Product.findById(product._id).then((response) => {
        Product.findByIdAndUpdate(
          product._id,
          { quantity: response.quantity - product.quantity },
          { new: true }
        ).then((response) => {
        });
      });
    });

    return res.status(201).json({ message: "Commande créée", newOrder });
  } catch (err) {
    console.error("catch error", err);
    return res
      .status(500)
      .json({ message: "Erreur lors de la création de la commande" });
  }
});

router.get("/all", isAuthenticated, async (req, res, next) => {
  const user = req.payload;

  try {
    const orders = await Order.find({ customer: user._id });

    if (orders.length === 0) {
      return res.status(404).json({ message: "can't find the order" });
    }

    return res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in the query of orders" });
  }
});

router.get("/:orderId", async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate(
      "customer products.product"
    );

    if (!order) {
      return res.status(404).json({ message: "can't find the order" });
    }

    return res.status(200).json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in the query of orders" });
  }
});

module.exports = router;
