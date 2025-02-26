const mongoose = require("mongoose");
const getchat = async (req, res) => {
  console.log(req.query);
  try {
    const user_id = req.user._id; // User ID from authentication middleware
    const {sessionId} = req.query; // Session ID from frontend (if any)
    const chatModel = mongoose.model("chatsession");
    if(sessionId){
      const fetchChat =await chatModel.find({ user_id: user_id ,sessionId:sessionId}).sort({ createdAt: -1 }); 
      // Respond to frontend with sessionId
      res.status(200).json({
        status: "success",
        data: fetchChat,
      })}else{
         const fetchChat =await chatModel.find({ user_id: user_id }).sort({ createdAt: -1 }); 
    // Respond to frontend with sessionId
    res.status(200).json({
      status: "success",
      data: fetchChat,
    });
      }

  } catch (error) {
    console.error("Error in chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }

  }

module.exports = getchat;
