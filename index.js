require("express-async-errors");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const port = 8000;
const userRoutes = require("./modules/users/user.routes");
const chatRoutes = require("./modules/chats/chat.routes");
const feedbackRoutes = require("./modules/feedback/feedback.routes")
const errorHandler = require("./handlers/errorHandler");
const fetchTweet = require("./modules/twitter/fetchTweet");
app.use(express.json());
app.use(cors());
// database connection
mongoose
  .connect(process.env.connection_string, {})
  .then(() => {
    console.log("DB connected!");
  })
  .catch(() => console.log("failed to connect to mono db database"));
//   load models
require("./models/users.model");
require("./models/otp.model");
require("./models/chat.model");
require("./models/feedback.model");
app.use("/api/user", userRoutes);
app.use("/api/chat",chatRoutes );
app.get("/api/fetchtweets", fetchTweet);
app.use("/api/feedback",feedbackRoutes)
// app.all("*",(req,res,next)=>{
//   res.status(404).json({
//     status:"failed",
//     message:"not found"
//   })
// })
// error handler
app.use(errorHandler);
app.listen(port, () => console.log(`app listening on port ${port}!`));
