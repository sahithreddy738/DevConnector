const User = require("../models/user");
const jwt=require("jsonwebtoken");
require("dotenv").config();

const userAuth=async (req,res,next) => {
    try{
        const {token}=req.cookies;
        if(!token) throw new Error("Token is not valid!!!!");
        const decodedMessage=jwt.verify(token,process.env.SECREAT_KEY);
        if(!decodedMessage) throw new Error("Token is not Valid!!!");
        const userId=decodedMessage._id;
        const user=await User.findById(userId);
        if(!user) throw new Error("Invalid User")
        req.user=user;    
        next();
     }catch(err) {
       res.status(400).send("ERROR:"+err.message);
     }
}
module.exports={
    userAuth
}