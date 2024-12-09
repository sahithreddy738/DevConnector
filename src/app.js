const express = require("express");
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");
const chatRouter = require("./routes/chat");
const messageRouter = require("./routes/message");
const socket = require("socket.io");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);
app.use("/", messageRouter);

connectDb()
  .then(() => {
    const server = app.listen(3000, () => {
      console.log("Sevrevr running on port 3000");
    });
    const io = new socket.Server(server, {
      cors: {
        origin: "http://localhost:5173",
        credentials: true,
      },
    });
    io.on("connection", (socket) => {
      console.log("User Connected " + socket.id);
      socket.on("join room", (selectedChat) => {
        if (!selectedChat) {
          console.log("Chat ID is missing while joining the room.");
          return;
        }
        socket.join(selectedChat);
        console.log(`Socket ${socket.id} joined room: ${selectedChat}`);
      });
      socket.on("message", (message) => {
        console.log("Message payload received:", message);

        if (!message || !message.chat) {
          console.log("Chat ID is missing or invalid in the payload.");
          return;
        }
        socket.to(message.chat._id).emit("message recieve", message);
        console.log("message received", message.message);
      });
      socket.on("disconnect", () => {
        console.log("User Disconnected " + socket.id);
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
