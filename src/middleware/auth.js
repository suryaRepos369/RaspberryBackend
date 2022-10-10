const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
console.log(" process.env.JWT_STR:", process.env.JWT_STR);

const auth = async (req, res, next) => {
  try {
    console.log("***************AUTH MIDDLEWARE***************");
    try {
      var token = req.header("Authorization").replace("Bearer", "");
      console.log("token:", token);
    } catch (err) {
      throw new Error("Token not found");
    }

    try {
      var decoded = await jwt.verify(token, process.env.JWT_STR);
      console.log("decoded:", decoded);
    } catch (error) {
      throw new Error(error);
      console.log(error);
    }
    try {
      var user = await User.findOne({
        _id: decoded._id,
      });
      console.log("user", user);
    } catch (error) {
      throw new Error("User not found");
      console.log("error:", error);
    }

    //const user1 = await User.updateOne({ _id: decoded._id }, { $pull: { tokens: { token } } });

    if (!user) {
      throw new Error("Please authenticate");
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ Error: e.message });
  }
};

module.exports = auth;
