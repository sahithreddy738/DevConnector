const { default: mongoose } = require("mongoose");


const chatSchema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    groupAdmin: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    members: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
    latestMessage: { type: mongoose.SchemaTypes.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
