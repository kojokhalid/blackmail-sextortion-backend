const mongoose = require("mongoose");
const handleFeedback = async (req, res) => {
  // console.log(req.body);
  const { feedback, helpfulness } = req.body;
  if (!feedback) throw new Error("Feedback is required");
  if (!helpfulness) throw new Error("Helpfulness is required");
  console.log(req.body);
  // Import the Feedback model
  const FeedbackModel = mongoose.model("feedbacks");
  const newFeedback = new FeedbackModel({
    feedback: feedback,
    helpfulness: helpfulness,
  });
  try {
    // Save to the database
    await newFeedback.save();
    res.status(200).json({
      status: "success",
      message: "Feedback saved successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
module.exports = handleFeedback;
