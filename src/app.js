const express = require("express");
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors=require("cors");

app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true            
}))
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

connectDb()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Sevrevr running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
