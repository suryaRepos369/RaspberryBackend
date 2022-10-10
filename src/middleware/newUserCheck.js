const User = require("../models/user");

const newCheck = async (req, res, next) => {
  try {
    const token = await user.generateAuthToken();
    console.log("token:", token);

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    console.log("Error Generating token");
  }
};

module.exports = newCheck;
