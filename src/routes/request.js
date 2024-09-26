const express = require("express");
const { userAuth } = require("../middlewares/authentication");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();
const { validateStatus } = require("../utils/validation");
const User = require("../models/user");

requestRouter.post("/request/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    if (!validateStatus(req)) throw new Error("Invalid Status");
    const toUser = await User.findOne({ _id: req.params.toUserId });
    if (!toUser) throw new Error("User not exist");
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId:req.params.toUserId },
        { fromUserId: req.params.toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionRequest) {
      throw new Error("Connection Request Already Exists");
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId: req.params.toUserId,
      status: req.params.status,
    });
    const savedRequest = await connectionRequest.save();
    res.json({ savedRequest });
  } catch (err) {
    res.status(400).send("ERROR!! " + err.message);
  }
});

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const loggedUser=req.user;
        const {status,requestId}=req.params;
        const allowedStatus=["accepted","rejected"];
        if(!allowedStatus.includes(status)) throw new Error("Status not allowed");
        const connectionRequest=await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedUser._id,
            status:"interested"
        });
        if(!connectionRequest) throw new Error("Request not exist")
        connectionRequest.status=status;
        const acceptedRequest=await connectionRequest.save();
        res.send({acceptedRequest});
    } catch(err) {
        res.status(400).send("ERROR!! "+err.message);
    }
})

module.exports = requestRouter;
