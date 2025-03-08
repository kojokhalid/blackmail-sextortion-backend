const mongoose = require("mongoose");
const getFeedback = async (req, res) => {
  const FeedbackModel = mongoose.model("feedbacks");
  const fetchedFeedback = await FeedbackModel.find({});
  console.log(fetchedFeedback);
  res.status(200).json({ success: "success", data: fetchedFeedback });
};
module.exports = getFeedback;
