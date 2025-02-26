const errorHandler = (error, req, res, next) => {
  if (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
  if (error.message) {
    res.status(400).json({ status: "failed", message: error.message });
  }
  next();
};
module.exports = errorHandler;
