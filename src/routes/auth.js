const express = require("express");
const { validateSignUp } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    if (!validateSignUp(req))
      throw new Error("Required email,firstName,lastName,password");
    const { firstName, lastName, email, password } = req.body;
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });
    await user.validate();
    const passwordHash = await bcrypt.hash(password, 10);
    user.password=passwordHash;
    const savedUser=await user.save();
    const userToken = savedUser.generateToken();
    res.cookie("token", userToken, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
    res.json({message:"User Saved Successfully",newUser:savedUser});
  } catch (err) {
    res.status(400).send(err.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Invalid Credentials");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid Credentials");
    const userToken = user.generateToken();
    res.cookie("token", userToken, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});
authRouter.post("/logout", (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Logged out Successfully");
  } catch (err) {
    res.status(400).send("ERROR!!" + err.message);
  }
});

module.exports = authRouter;
