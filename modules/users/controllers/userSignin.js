const mongoose = require("mongoose");
// bcrypt for password hashing
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtManager = require("../../../managers/jwtManager");
const userSignin = async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  if (!password || !username) {
    throw new Error("All fields are required");
  }
  //
  const userModel = mongoose.model("users");
  const getUser = await userModel.findOne({ username: username });
  if (!getUser) {
    throw new Error("Invalid credentials");
  }
  const isPasswordCorrect = await bcrypt.compare(password, getUser.password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials");
  }
  console.log(getUser);
  if (getUser.verified==false) {
    // throw new Error("User not verified");
  res.status(200).json({
    status: "success",
    message: "User not verified",
    verified: false
  });

  }
  const { accessToken, refreshToken } = jwtManager(getUser);

  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    accessToken: accessToken,
    username: getUser.username,
    refreshToken: refreshToken,
  });
};
module.exports = userSignin;
