const express = require("express");
const { userAuth } = require("../middlewares/authentication");
const Chat = require("../models/chat");
const User = require("../models/user");

const chatRouter = express.Router();

chatRouter.get("/chat", userAuth, async (req, res) => {
  try {
    const chats = await Chat.find({
      members: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("members", "-password")
      .populate("groupAdmin", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "firstName lastName email",
        },
      })
      .sort({ updatedAt: -1 });
    res.send({ data: chats });
  } catch (error) {
    res.status(400).send("No Chats Found");
  }
});

chatRouter.post("/groupChat", userAuth, async (req, res) => {
  const { chatName, users } = req.body;
  if (!chatName || !users) throw new Error("Missing out fields to create Chat");
  if (users.length < 2) throw new Error("Min 2 Users to create group chat");
  users.push(req.user._id);
  try {
    const groupChat = await Chat.create({
      chatName,
      isGroupChat: true,
      members: users,
      groupAdmin: req.user._id,
    });
    const groupChatDetails = await Chat.find({ _id: groupChat._id })
      .populate("members", "-password")
      .populate("groupAdmin", "-password");
    res.send({ data: groupChatDetails });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

chatRouter.patch("/chat/rename", userAuth, async (req, res) => {
  try {
    const { chatName, chatId } = req.body;
    if (!chatName || !chatId)
      throw new Error("Missing fields to update chat name");
    const chatToUpdate = await Chat.findOne({ _id: chatId });
    if (!chatToUpdate) throw new Error("Not Found Chat to Update");
    await Chat.findOneAndUpdate(
      {
        _id: chatId,
      },
      {
        chatName,
      }
    );
    res.send({ data: "Updated Name of Chat" });
  } catch (err) {
    res.status(400).send("ERROR ! " + err.message);
  }
});

chatRouter.patch("/groupChat/addMember", userAuth, async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) throw new Error("Missing requird Fields");
    const chatToUpdate = await Chat.findOne({ _id: chatId });
    if (!chatToUpdate) throw new Error("Not Found Chat to Update");
    const userToAdd = await User.findOne({ _id: userId });
    if (!userToAdd) throw new Error("No User Found to add in the group");
    const updatedChat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        isGroupChat: true,
      },
      {
        $push: { members: userId },
      },
      {
        returnDocument: "after",
      }
    )
      .populate("members", "-password")
      .populate("groupAdmin", "-password");
    res.send({ data: updatedChat });
  } catch (err) {
    res.status(400).send("ERROR ! " + err.message);
  }
});

chatRouter.patch("/groupChat/deleteMember", userAuth, async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) throw new Error("Missing requird Fields");
    const chatToUpdate = await Chat.findOne({ _id: chatId });
    if (!chatToUpdate) throw new Error("Not Found Chat");
    const userToAdd = await User.findOne({ _id: userId });
    if (!userToAdd) throw new Error("No User Found to delete in the group");
    const deletedMemberChat = await Chat.findByIdAndUpdate(
      {
        _id: chatId,
        isGroupChat: true,
      },
      {
        $pull: { members: userId },
      },
      {
        returnDocument: "after",
      }
    )
      .populate("members", "-password")
      .populate("groupAdmin", "-password");
    res.send({ data: deletedMemberChat });
  } catch (err) {
    res.status(400).send("ERROR ! " + err.message);
  }
});

chatRouter.post("/chat/:userId", userAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw new Error("Missing Id to create Chat");
    }
    const toChatUser = await User.findOne({ _id: userId });
    if (!toChatUser) throw new Error("User Not exist to Chat");
    const isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        {
          members: { $elemMatch: { $eq: req.user._id } },
        },
        {
          members: { $elemMatch: { $eq: userId } },
        },
      ],
    })
      .populate("members", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "firstName lastName email",
        },
      });
    if (isChat.length > 0) {
      res.send({ data: isChat[0] });
    } else {
      let chatData = {
        chatName: toChatUser.firstName + " " + req.user.firstName,
        members: [userId, req.user._id],
        isGroupChat: false,
      };
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({
        _id: createdChat._id,
      }).populate("members", "-password");
      res.send({ data: fullChat });
    }
  } catch (error) {
    res.status(400).send("ERROR !" + error.message);
  }
});
chatRouter.get("/chat/:chatId", userAuth, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    if (!chatId) throw new Error("ChatId Required");
    const chat = await Chat.findOne({ _id: chatId })
      .populate("members", "firstName lastName photoURL")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "firstName lastName email",
        },
      });
    if (!chat) throw new Error("Chat Not Found");
    res.send({data:chat});
  } catch (err) {
    res.status(400).send("Failed to fetch "+err.message);
  }
});

module.exports = chatRouter;
