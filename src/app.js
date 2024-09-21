const express=require("express");

const app=express();

// app.use("/",(req,res)=>{
//     res.send("hello")
// })
app.use("/hello",(req,res)=>{
    res.send("Hello from hello route");
})
app.get("/user",(req,res)=>{
    res.send({"id":req.query.userId,"firstName":"sahith","city":"Hyderabad"});
})
app.get("/user/:userId",(req,res)=>{
    console.log(req.params);
    res.send({"id":req.params.userId,"firstName":"sahith","city":"Hyderabad"});
})
app.post("/user",(req,res)=>{
     res.send("Data Saved Successfully");
})
app.patch("/user",(req,res)=>{
    res.send("Updated Data Successfully");
})
app.delete("/user",(req,res)=>{
    res.send("Data deleted successfully");
})

app.listen(3000,() => {
    console.log("Sevrevr running on port 3000")
})