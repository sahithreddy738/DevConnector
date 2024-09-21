const express=require("express");

const app=express();

app.use("/",(req,res)=>{
   res.send("HomePage");
})

app.listen(3000,() => {
    console.log("Sevrevr running on port 3000")
})