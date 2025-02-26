const mongoose = require("mongoose");
const userDashboard = async (req, res) => {
  const userModel = mongoose.model("users");
  //   const transactionModel = mongoose.model("transactions");
//   console.log(req)
  const getUser = await userModel
    .findOne({ _id: req.user._id })
    .select("-password");

  res.status(200).json({
    status: "success",
    data: getUser,
  });
};
module.exports = userDashboard;
