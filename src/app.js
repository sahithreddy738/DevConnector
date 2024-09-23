const express=require("express");
const connectDb=require("./config/database");
const User=require("./models/user");
const app=express();

app.use(express.json());
//save user
app.post("/signup",async (req,res)=>{
    try{
      const user=new User(req.body);
      await user.save();
      res.send("User Saved Successfully");
    } catch(err) {
        res.status(400).send(err.message);
    }
})
//get all users
app.get("/feed",async (req,res) => {
   try {
      const users=await User.find({});
      res.send(users);
   } catch(err) {
    res.status(400).send(err.message);
}
})
//get user by email using find
app.get("/user",async (req,res) =>{
    try{
      const users=await User.find({email:req.body.email});
      if(users.length===0) res.send("User not found");
      else res.send(users);
    } catch(err) {
        res.status(400).send("Something went wrong");
    }
})
//get user by email with findOne
app.get("/user/:emailId",async (req,res)=>{
  try{
   const user=await User.findOne({email:req.params.emailId});
   res.send(user);
  } catch(err) {
    res.status(400).send("Something went wrong");
  }
})
//update an user
app.patch("/user",async (req,res)=>{
    try{
      const updatedUser=await User.findByIdAndUpdate(req.body.userId,req.body,{returnDocument:'after'});
      res.send(updatedUser);
    }catch(err) {
    res.status(400).send("Something went wrong");
  }
})
//delete an user
app.delete("/user",async (req,res) => {
    try{
     await User.findByIdAndDelete(req.body.userId);
     res.send("deleted successfully");
    }catch(err) {
    res.status(400).send("Something went wrong");
  }
})

connectDb() 
.then(()=>{
    console.log("Database connected successfully")
    app.listen(3000,() => {
        console.log("Sevrevr running on port 3000")
    })
}).catch((err)=>{
    console.log(err);
})
