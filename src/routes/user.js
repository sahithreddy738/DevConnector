const express = require("express");
const { userAuth } = require("../middlewares/authentication");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");
const userRouter = express.Router();

const USER_DATA_TO_SEND = "firstName lastName photoURL skills age gender about";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_DATA_TO_SEND);
    const updatedPendingRequest = pendingRequests.map((pending) => {
      return { _id:pending._id,fromUserId: pending.fromUserId, createdAt: pending.createdAt };
    });
    res.json({ receivedRequests: updatedPendingRequest });
  } catch (err) {
    res.status(400).send("ERROR!! " + err.message);
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const userConnectionsRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_DATA_TO_SEND)
      .populate("toUserId", USER_DATA_TO_SEND);
    const userConnections = userConnectionsRequests.map((request) => {
      if (request.fromUserId._id.equals(loggedInUser._id)) {
        return request.toUserId;
      }
      return request.fromUserId;
    });
    res.json({ userConnections });
  } catch (err) {
    res.status(400).sen("ERROR!! " + err.message);
  }
});
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page=req.query.page||1;
    let limit=req.query.limit||30;
    limit=(limit>30)?30:limit;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_DATA_TO_SEND).skip(page*limit-limit).limit(limit);
    res.json({ feedData:users });
  } catch (err) {
    res.send("ERROR!!: " + err.message);
  }
});

module.exports = userRouter;
