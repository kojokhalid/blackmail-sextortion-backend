const mongoose = require("mongoose");
// bcrypt for password hashing
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const jwt = require("jsonwebtoken");
const jwtManager = require("../../../managers/jwtManager");
const resendOTP = async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  
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
 var transport = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MY_GMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  // generete OTP
  const OTP = Math.floor(100000 + Math.random() * 900000);

   // update the OTP in the database
   const otpModel = mongoose.model("otps");
   const storeOtp = await otpModel.findOneAndUpdate(
     { user_id: getUser._id },
     { otp: OTP, email: getUser.email },
     { new: true, upsert: true }
   );
   if (!storeOtp) throw new Error("Failed to update OTP");
   console.log(OTP);
   const sendMail = await transport.sendMail({
    from: "no-reply@evebot.com",
    to: getUser.email,
    subject: "Evebot: Verification code",
    text:
      "Dear Eve user, your verification code is " +
      OTP +
      " The code is valid for 10 minutes. Do not share this code with anyone.",
  });
if (!sendMail) throw new Error("Failed to send OTP");
const { accessToken, refreshToken } = jwtManager(getUser);

  res.status(200).json({
    status: "success",
    message: "OTP sent successfully",  
    accessToken: accessToken,  
  });
};
module.exports = resendOTP;
