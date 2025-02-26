const express = require("express");
const auth = require("../../middlewares/auth");
const getchat = require("./controllers/getChat");
const authChat = require("./controllers/authchat");
const noauthChat = require("./controllers/noauthchat");
const chatRoutes = express.Router();
chatRoutes.post("/noauth", noauthChat);
chatRoutes.use(auth);
chatRoutes.post("/auth", authChat);
chatRoutes.get("/auth", getchat);

module.exports = chatRoutes;
