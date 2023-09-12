// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const productRoutes = require("./routes/product.routes");
app.use("/product", productRoutes);

const reviewRoutes = require("./routes/review.routes");
app.use("/review", reviewRoutes);

const profileRoutes = require("./routes/profile.routes");
app.use("/profile", profileRoutes);

const chatRoutes = require("./routes/chat.routes");
app.use("/chat", chatRoutes);

const messageRoutes = require("./routes/message.routes");
app.use("/messages", messageRoutes);

const orderRoutes = require("./routes/order.routes");
app.use("/orders", orderRoutes);

const paymentRoutes = require("./routes/payment.routes");
app.use("/stripe", paymentRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
