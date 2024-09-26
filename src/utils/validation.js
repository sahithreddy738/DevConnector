const validator=require("validator");
const validateSignUp = (req) => {
  const AllowedFields = ["email", "firstName", "password", "lastName"];
  const isSignUpAllowed = Object.keys(req.body).every((key) =>
    AllowedFields.includes(key)
  );
  return isSignUpAllowed;
};

const validateProfileUpdateData = (req) => {
  const allowedUpdateFields = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "about",
    "skills",
    "photoURL",
  ];
  const isUpdateAllowed = Object.keys(req.body).every((key) =>
    allowedUpdateFields.includes(key)
  );
  return isUpdateAllowed;
};
const validatePasswordUpdateData=(req) =>{
  const allowedPassowrdUpdateFields=["email","password","newPassword"];
  const isPasswordUpdateAllowed=Object.keys(req.body).every(key=>allowedPassowrdUpdateFields.includes(key));
  if(!validator.isStrongPassword(req.body.newPassword)) throw new Error("Enter new strong password");
  return isPasswordUpdateAllowed;
}
const validateStatus=(req) => {
  const allowedStatus=["interested","ignored"];
  return allowedStatus.includes(req.params.status);
}
module.exports = {
  validateSignUp,
  validateProfileUpdateData,
  validatePasswordUpdateData,
  validateStatus
};
