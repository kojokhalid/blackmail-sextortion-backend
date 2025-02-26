const noauthChat = async (req, res) => {
  const url = "https://api.hyperbolic.xyz/v1/chat/completions";
  const userMessage = req.body.message;
  console.log(userMessage);
  if (!userMessage) {
    throw new Error("Message is required");
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.HYPERBOLIC_API_KEY,
    },
    body: JSON.stringify({
      model: "meta-llama/Llama-3.2-3B-Instruct",
      messages: [
        {
          role: "system",
          content: `You are assisting victims of online blackmail and sextortion in Ghana. Contact Cybercrime Unit at 0592522300 or toll-free 18555 for help. Respond only to relevant inquiries.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_tokens: 256,
      temperature: 0.7,
      top_p: 0.9,
      stream: false,
    }),
  });

  const json = await response.json();

  const output = json.choices[0].message.content;
  console.log(output);
  res.status(200).json({
    status: "success",
    user: userMessage,
    bot: output,
  });
};
module.exports = noauthChat;
