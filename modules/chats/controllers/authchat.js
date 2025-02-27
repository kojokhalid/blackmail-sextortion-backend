const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const authChat = async (req, res) => {

  
  try {
    const userMessage = req.body.message;
    const user_id = req.user._id;
    let sessionId = req.body.sessionId || req.params.sessionId;

    const chatModel = mongoose.model("chatsession");

    // If no message and sessionId, fetch chat history
    if (req.method === "GET" && sessionId) {
      const session = await chatModel.findOne({ sessionId, user_id });
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      return res.status(200).json({ data: session });
    }

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }
// Using llama via hyperbolic
    const url = "https://api.hyperbolic.xyz/v1/chat/completions";
    const response1 = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HYPERBOLIC_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.2-3B-Instruct",
        messages: [
          {
            role: "system",
            content:
              "You are assisting victims of online blackmail and sextortion.",
          },
          { role: "user", content: userMessage },
        ],
        max_tokens: 500,
      }),
    });

// Using Gemini 
//   const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" },{ apiVersion: 'v1beta'});

// const prompt = `You are assisting victims of online blackmail and sextortion and creating awareness only, do not answer anything outside online sextortion and blackmail. You provide clear, concise, and accurate information. Please answer the following question: ${userMessage}`;

// const result = await model.generateContent(prompt);
// // console.log(result.response.text());
// const botResponse2 = result.response.text();

    
    const json = await response1.json();
    const botResponse =
      json.choices?.[0]?.message?.content || "No response from bot";

    // Generate new sessionId if none exists
    if (!sessionId) sessionId = uuidv4();

    const updatedSession = await chatModel.findOneAndUpdate(
      { sessionId, user_id },
      {
        $setOnInsert: {
          sessionTitle: userMessage.slice(0, 30),
          sessionId,
          user_id,
        },
        $push: {
          messages: {
            $each: [
              { sender: "user", message: userMessage },
              { sender: "bot", message: botResponse },
            ],
          },
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      status: "success",
      sessionId,
      bot: botResponse,
    });
  } catch (error) {
    // console.error("Error in authChat:", error);
    res.status(500).json({ error: "Internal server error" });
  }  
};

module.exports = authChat;
