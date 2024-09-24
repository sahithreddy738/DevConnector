const validateSignUp = (req) => {
  const AllowedFields = ["email", "firstName", "password", "lastName"];
  const isSignUpAllowed = Object.keys(req.body).every((key) =>
    AllowedFields.includes(key)
  );
  return isSignUpAllowed;
};

module.exports = {
  validateSignUp,
};
