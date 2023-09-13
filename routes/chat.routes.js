const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat.model");
const User = require("../models/User.model");

//create chat
router.post("/create", async (req, res, next) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await Chat.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat) return res.status(200).json(chat);

    const newChat = await Chat.create({
      members: [firstId, secondId],
    });
    const response = await newChat.save();

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;

  try {
    const chats = await Chat.find({ members: { $in: [userId] } });
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/find/:firstId/:secondId", async (req, res, next) => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await Chat.find({ members: { $all: [firstId, secondId] } });
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/user/:userId", async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;