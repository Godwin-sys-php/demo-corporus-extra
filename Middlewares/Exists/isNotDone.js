module.exports = async (req, res, next) => {
  if (req._session.isDone) {
    return res.status(400).json({ error: true, message: "Session terminée" });
  }
  return next();
}