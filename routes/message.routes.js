const express = require("express");
const router = express.Router();
const Message = require("../models/Message.model");

// create message
router.post("/create", async (req, res, next) => {
  const { chatId, senderId, message } = req.body;

  const newMessage = new Message({
    chatId,
    senderId,
    message,
  });
  
  try {
    const response = await newMessage.save();

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
});

// getting messages
router.get("/find/:chatId", async (req, res, next) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
