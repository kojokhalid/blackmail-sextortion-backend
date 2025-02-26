const mongoose = require("mongoose");
const verifyOtp = async (req, res) => {
  console.log(req.body);
  const { otp } = req.body;
  if (!otp) throw new Error("OTP is required");
  const { _id, email } = req.user;
  console.log(req.user);
  console.log(_id);
  const otpModel = mongoose.model("otps");
  const getOtp = await otpModel.findOne({ email: email });
  console.log(getOtp.email);
  //   if (!getOtp) throw new Error("Invalid OTP");
  if (getOtp.isUsed) throw new Error("OTP already used");
  if (getOtp.createdAt < Date.now() - 300000) throw new Error("OTP expired");
  if (getOtp.otp != otp) throw new Error("Invalid OTP");
  await otpModel.updateOne({ email: email }, { isUsed: true });
  const usersModel = mongoose.model("users");
  const updateUser = await usersModel.updateOne(
    { email: email },
    { verified: true }
  );

  res.status(200).json({
    status: "success",
    message: "OTP verified",
  });
};
module.exports = verifyOtp;
