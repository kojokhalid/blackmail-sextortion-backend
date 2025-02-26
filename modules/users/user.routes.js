const express = require("express");
const userRegister = require("./controllers/userRegister");
const userSignin = require("./controllers/userSignin");
const resendOTP = require("./controllers/resendOTP");
const verifyOtp = require("./controllers/verifyOtp");
const auth = require("../../middlewares/auth");
const refresh = require("./controllers/refresh");
const userDashboard = require("./controllers/userDashboard");

const userRoutes = express.Router();
userRoutes.post("/register", userRegister);
userRoutes.post("/signin", userSignin);
userRoutes.post("/refresh", refresh);
userRoutes.post("/resendotp", resendOTP);
userRoutes.use(auth);
userRoutes.post("/verifyotp", verifyOtp);
userRoutes.post("/dashboard", userDashboard);

module.exports = userRoutes;
