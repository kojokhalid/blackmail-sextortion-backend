const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtManager = require("../../../managers/jwtManager");
const nodemailer = require("nodemailer");
const { default: mongoose } = require("mongoose");
const userRegister = async (req, res) => {
  const { username, email, password, confirm_password } = req.body;
  // validate the user input
  if (!username) throw new Error("Username is required");
  if (!email) throw new Error("Email is required");
  if (!password) throw new Error("Password is required");
  if (!confirm_password) throw new Error("Confirm Password is required");
  if (password !== confirm_password) throw new Error("Password does not match");
  // check if the user already exists
  const usersModel = mongoose.model("users");
  const userExists = await usersModel.findOne({ email });
  if (userExists) throw new Error("User already exists");
  // hash the password
  const hashedPassword = await bcrypt.hash(password, 12);
  // save the user to the database
  const createdUser = await usersModel.create({
    username,
    email,
    password: hashedPassword,
  });
  if (!createdUser) throw new Error("Failed to create user");
  // generate the token
  const { accessToken, refreshToken } = jwtManager(createdUser);
  // send email to the user
  // Looking to send emails in production? Check out our Email API/SMTP product!
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

  // store the OTP in the database
  const otpModel = mongoose.model("otps");
  const storeOtp = await otpModel.create({
    user_id: createdUser._id,
    otp: OTP,
    email,
  });
  if (!storeOtp) throw new Error("Failed to create OTP");
  console.log(OTP);
  transport.sendMail({
    from: "no-reply@evebot.com",
    to: createdUser.email,
    subject: "Evebot: Verification code",
    text:
      "Dear Eve user, your verification code is " +
      OTP +
      " The code is valid for 10 minutes. Do not share this code with anyone.",
  });
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Prevent access from JavaScript
    secure: true, // HTTPS only (set to true in production)
    sameSite: "Strict",
  });
  res.status(200).json({
    status: "success",
    accessToken,
    refreshToken: refreshToken,
  });
};
module.exports = userRegister;
