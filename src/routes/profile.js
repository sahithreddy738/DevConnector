const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/authentication");
const {
  validateProfileUpdateData,
  validatePasswordUpdateData,
} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileUpdateData(req)) throw new Error("Please Check Fields");
    const loggedInUser = req.user;
    const updatedUser = await User.findByIdAndUpdate(
      loggedInUser._id,
      req.body,
      { returnDocument: "after",runValidators:true }
    );
    res.json({
      user: updatedUser,
      message: `${updatedUser.firstName} profile updated successfully`,
    });
  } catch (err) {
    res.status(400).json({message:"ERROR!!: " + err.message});
  }
});
profileRouter.patch("/profile/password", async (req, res) => {
  try {
    if (!validatePasswordUpdateData(req)) throw new Error("Invalid Fields");
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("Invalid User");
    const newPasswordHash = await bcrypt.hash(req.body.newPassword, 10);
    await User.findByIdAndUpdate(
      user._id,
      { password: newPasswordHash },
      { returnDocument: "after" }
    );
    res.json({ message: "Updated Password Successfully" });
  } catch (err) {
    res.status(400).send("ERROR!!: " + err.message);
  }
});

module.exports = profileRouter;
