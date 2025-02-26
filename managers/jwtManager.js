const jwt = require("jsonwebtoken");
const jwtManager = (user) => {
  const accessToken = jwt.sign(
    { _id: user._id, email: user.email, username: user.name,verified:user.verified },
    process.env.secret_key,
    {
      expiresIn: "60m", // 15 minutes
    }
  );
  const refreshToken = jwt.sign(
    { _id: user._id, email: user.email, username: user.name,verified:user.verified },
    process.env.secret_key_refresh,
    {
      expiresIn: "15d", // 15 d
    }
  );
  return { accessToken, refreshToken };
};
module.exports = jwtManager;
