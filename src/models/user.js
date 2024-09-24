const mongoose=require("mongoose");
const validator=require("validator");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"First Name is required"],
        trim:true,
        minLength:4,
        maxLength:20
    },
    lastName:{
        type:String,
        trim:true,
        required:true,
        minLength:4,
        maxLength:20
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate:(value) => {
            if(!validator.isEmail(value)) throw new Error("Provide Valid emailId");
        }
    },
    password:{
        type:String,
        required:true,
        validate:(value) => {
            if(!validator.isStrongPassword(value)) throw new Error("Provide valid password");
        }
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        enum:["Male","Female","Others"]
    },
    about:{
        type:String,
        default:"This is about the user",
        maxLength:150
    },
    photoURL:{
        type:String,
        validate:(value) => {
            if(!validator.isURL(value)) throw new Error("Provide Valid URL");
        },
        default:"https://as1.ftcdn.net/v2/jpg/03/39/45/96/1000_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg"
    },
    skills:{
        type:[String],
        validate:function(value) {
            if(value.length>10) throw new Error("Max 10 skills are allowed");
        }
    }
},{timestamps:true});

const User=mongoose.model("User",userSchema);

module.exports=User;