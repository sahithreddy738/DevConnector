const express = require("express");
const bcrypt = require("bcrypt");
const connectDb = require("./config/database");
const User = require("./models/user");
const { validateSignUp } = require("./utils/validation");
const app = express();

app.use(express.json());
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
app.post("/login",async (req,res) => {
  try {
    const {email,password}=req.body;
    const user=await User.findOne({email:email});
    if(!user) throw new Error("Invalid Credentials");
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid) throw new Error("Invalid Credentials");
    res.send("Logged In Successfully!!!")
  }catch (err) {
    res.status(400).send("ERROR:"+err.message);
  }
})
//get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
});
//get user by email using find
app.get("/user", async (req, res) => {
  try {
    const users = await User.find({ email: req.body.email });
    if (users.length === 0) res.send("User not found");
    else res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
//get user by email with findOne
app.get("/user/:emailId", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.emailId });
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
//update an user
app.patch("/user/:userId", async (req, res) => {
  try {
    const AllowedUpdates = ["skills", "gender", "photoURL", "about", "age"];
    const isUpdateAllowed = Object.keys(req.body).every((key) =>
      AllowedUpdates.includes(key)
    );
    if (!isUpdateAllowed) throw new Error("check fields for update");
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { returnDocument: "after", runValidators: true }
    );
    res.send(updatedUser);
  } catch (err) {
    res.status(400).send("UPDATE FAILED:" + err.message);
  }
});
//delete an user
app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.userId);
    res.send("deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
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
