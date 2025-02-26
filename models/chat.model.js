const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import UUID for generating session IDs

const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "bot"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    default: uuidv4, // Generate a UUID for each new session
    unique: true,
  },
  sessionTitle: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  messages: [chatMessageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const chatModel = mongoose.model("chatsession", chatSessionSchema);
module.exports = chatModel;
