const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Unauthorized");
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Unauthorized");
    }
    const jwt_payload = await jwt.verify(token, process.env.secret_key);
    req.user = jwt_payload;
  } catch (err) {
    res.status(401).json({ status: "failed", message: err.message });
    return;
  }

  next();
};
module.exports = auth;
