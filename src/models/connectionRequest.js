const mongoose=require("mongoose");

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User",
        required:true
    },
    toUserId:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        enum:["interested","ignored","accepted","rejected"],
        required:true
    }
},{timestamps:true});

connectionRequestSchema.index({fromUserId:1,toUserId:1});

connectionRequestSchema.pre("save",function(next) {
  if(this.fromUserId.equals(this.toUserId)) throw new Error("You cannot sent request to yourself");
  next();
})

const ConnectionRequest=mongoose.model("ConnectionRequest",connectionRequestSchema);


module.exports=ConnectionRequest;