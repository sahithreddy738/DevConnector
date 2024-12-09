const express = require("express");
const { userAuth } = require("../middlewares/authentication");
const Message = require("../models/message");
const { populate } = require("../models/user");

const messageRouter = express.Router();

messageRouter.post("/message", userAuth, async (req, res) => {
  try {
    const { message, chatId } = req.body;
    if (!message || !chatId)
      throw new Error("missing fields to create message");
    let createdMessage = await Message.create({
      chat: chatId,
      sender: req.user._id,
      message,
    });
    createdMessage = await createdMessage.populate(
      "sender",
      "firstName photoURL"
    );
    createdMessage = await createdMessage.populate({
      path: "chat",
      populate: {
        path: "members",
        select: "firstName photoURL",
      },
    });
    res.send({ data: createdMessage });
  } catch (error) {
    res.status(400).send("Failed to create Message" + error.message);
  }
});
messageRouter.get("/message/:chatId", userAuth, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;
    limit = limit > 20 ? 20 : limit;
    if (!chatId) throw new Error("Provide chatId correctly");
    const chatMessages = await Message.find({ chat: chatId })
      .sort({ createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("sender", "firstName lastName photoURL")
      .populate({
        path: "chat",
        populate: {
          path: "members",
          select: "firstName photoURL",
        },
      });
    res.send({ data: chatMessages });
  } catch (error) {
    res.send("Failed to fetch Messages " + error.message).status(400);
  }
});

module.exports = messageRouter;
