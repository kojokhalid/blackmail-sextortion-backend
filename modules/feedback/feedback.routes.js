const express = require("express");
const handleFeedback = require("./controllers/handleFeedback");
const getFeedback = require("./controllers/getFeedback");
const handleChatFeedback = require("./controllers/handleChatFeedback");
const feedbackRoutes = express.Router();
feedbackRoutes.post("/v1", handleFeedback);
feedbackRoutes.get("/v1", getFeedback);
feedbackRoutes.post("/v1/chat", handleChatFeedback);

module.exports = feedbackRoutes;
