const mongoose = require("mongoose");
const handleChatFeedback = async (req, res) => {
  const { feedback, sessionId } = req.body;
  if (!feedback) throw new Error("Feedback is required");
  if (!sessionId) throw new Error("Session ID is required");
  console.log(req.body);
  // Import the Feedback model
  const FeedbackModel = mongoose.model("feedbacks");
  const newFeedback = new FeedbackModel({
    feedback: feedback,
    sessionId: sessionId,
  });
  try {
    // Save to the database
    await newFeedback.save();
    res.status(200).json({
      status: "success",
      message: "Response saved successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = handleChatFeedback;
