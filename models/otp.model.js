const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  otp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // OTP expires after 10 minutes (300 seconds)
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
});

// Create the model
const OTP = mongoose.model("otps", otpSchema);

// Export the model
module.exports = OTP;
