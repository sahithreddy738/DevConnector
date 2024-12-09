const { default: mongoose } = require("mongoose");


const messageSchema=new mongoose.Schema({
   message:{type:String},
   chat:{type:mongoose.SchemaTypes.ObjectId,ref:"Chat"},
   sender:{type:mongoose.SchemaTypes.ObjectId,ref:"User"},
},{timestamps:true})

const Message=mongoose.model("Message",messageSchema);

module.exports=Message;