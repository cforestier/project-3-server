const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const cors = require("cors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/charge", async (req, res) => {
  let { amount, id } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "EUR",
      description: "test 1",
      payment_method: id,
      confirm: true,
      automatic_payment_methods: {
        allow_redirects: "always",
        enabled: "true",
      },
    });
    console.log(payment);
    res.json({
      message: "Payment made",
      success: true,
    });
  } catch (error) {
    console.log("erreur...", error);
    res.json({
      message: "payment failed",
      success: false,
    });
  }
});

module.exports = router;
