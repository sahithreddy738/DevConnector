const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
      minLength: 4,
      maxLength: 20,
      message:"Provide name between 4 and 20 length"
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      minLength: 4,
      maxLength: 20,
       message:"Provide name between 4 and 20 length"
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => {
          return validator.isEmail(value);
        },
        message: "Invalid Email",
      }
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (value) => {
          return validator.isStrongPassword(value);
        },
        message: "Provide a stronger password",
      },
    },
    age: {
      type: Number,
      min: 18,
      trim:true,
      message:"Age should above 18"
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others","male","female"],
      trim:true,
      message:"Provide Gender Correctly"
    },
    about: {
      type: String,
      default: "This is about the user",
      maxLength: 250,
      message:"About:Max 250 Length Allowed"
    },
    photoURL: {
      type: String,
      validate: {
        validator: (value) => validator.isURL(value),
        message: "Provide a valid photo format",
      },
      default:
        "https://as1.ftcdn.net/v2/jpg/03/39/45/96/1000_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg",
    },
    skills: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length <= 10;
        },
        message: "Max 10 skills are allowed",
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.generateToken = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.SECREAT_KEY, {
    expiresIn: "1d",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
