const express=require("express");
const { userAuth } = require("../middlewares/authentication");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter=express.Router();

const USER_DATA_TO_SEND="firstName lastName photoURL skills";

userRouter.get("/user/requests/received",userAuth,async(req,res) => {
    try{ 
      const loggedInUser=req.user;
      const pendingRequests=await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status:"interested"
      }).populate("fromUserId",USER_DATA_TO_SEND);
      const updatedPendingRequest=pendingRequests.map((pending)=>{ return {fromUserId:pending.fromUserId,createdAt:pending.createdAt}});
      res.json({receivedRequests:updatedPendingRequest});
    }catch(err) {
        res.status(400).send("ERROR!! "+err.message);
    }
})
userRouter.get("/user/connections",userAuth,async(req,res) => {
    try{
      const loggedInUser=req.user;
      const userConnectionsRequests=await ConnectionRequest.find({
        $or:[
            {fromUserId:loggedInUser._id,status:"accepted"},
            {toUserId:loggedInUser._id,status:"accepted"}
        ]
      }).populate("fromUserId",USER_DATA_TO_SEND)
        .populate("toUserId",USER_DATA_TO_SEND);
     const userConnections=userConnectionsRequests.map((request)=> {
        if(request.fromUserId._id.equals(loggedInUser._id)) {
            return request.toUserId;
        } 
        return request.fromUserId;
     })
     res.json({userConnections});
    }catch(err) {
        res.status(400).sen("ERROR!! "+err.message);
    }
})


module.exports=userRouter;