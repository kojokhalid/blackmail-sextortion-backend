const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  helpfulness: {
    type: String,
    required: false,
  },
  sessionId: {
    type: String,
    required: false,
  },
  feedback: {
    type: String,
    required: false,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FeedbackModel = mongoose.model("feedbacks", feedbackSchema);
module.exports = FeedbackModel;
