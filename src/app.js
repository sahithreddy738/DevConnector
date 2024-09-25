const express = require("express");
const bcrypt = require("bcrypt");
const connectDb = require("./config/database");
const User = require("./models/user");
const { validateSignUp } = require("./utils/validation");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/authentication");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cookieParser());
//save user
app.post("/signup", async (req, res) => {
  try {
    if (!validateSignUp(req))
      throw new Error("Required only email,firstName,lastName,password");
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: passwordHash,
    });
    await user.save();
    res.send("User Saved Successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Invalid Credentials");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid Credentials");
    const userToken = user.generateToken();
    res.cookie("token", userToken, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
    res.send("Logged In Successfully!!!");
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

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
