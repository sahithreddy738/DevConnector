const express=require("express");
const connectDb=require("./config/database");
const User=require("./models/user");
const app=express();

app.post("/signup",async (req,res)=>{
    try{
      const user=new User({
        firstName:"Sahith",
        lastName:"Reddy",
        email:"sahithreddy@gmail.com",
        password:"Sahith123",
        age:22,
        gender:"Male"
      });
      await user.save();
      res.send("User Saved Successfully");
    } catch(err) {
        res.status(400).send(err.message);
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
