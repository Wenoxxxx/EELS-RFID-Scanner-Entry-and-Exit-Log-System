module.exports = (req, res, next) => {
  const { mode } = req.body;
  if (!["IN", "OUT"].includes(mode)) {
    return res.status(400).json({ message: "Invalid mode" });
  }
  next();
};