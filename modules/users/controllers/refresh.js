const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.secret_key_refresh, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if invalid

    const accessToken = jwt.sign(
      { _id: user._id, email: user.email, username: user.name },
      process.env.secret_key,
      {
        expiresIn: "15m", // 15 minutes
      }
    );
    res.json({ accessToken });
  });
};
module.exports = refresh;
