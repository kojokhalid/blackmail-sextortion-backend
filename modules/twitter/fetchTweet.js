const axios = require("axios");
require("dotenv").config();
const fetchTweet = async (req, res) => {
  const token = process.env.BEARER_TOKEN;
  const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

  async function getTweets() {
    const params = {
      query:
        "blackmail OR sextortion -is:retweet lang:en ",
      "tweet.fields": "author_id,created_at",
    };

    try {
      const response = await axios.get(endpointUrl, {
        headers: {
          "User-Agent": "v2RecentSearchJS",
          Authorization: `Bearer ${token}`,
        },
        params,
      });
      res.json(response.data);
      console.log("requested")
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Execute the function
  (async () => {
    await getTweets();
  })();
};
module.exports = fetchTweet;
