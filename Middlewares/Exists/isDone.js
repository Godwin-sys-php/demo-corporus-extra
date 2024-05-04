module.exports = async (req, res, next) => {
  if (req._session.isDone) {
    return next();
  }
  return res.status(400).json({ error: true, message: "Session pas encore terminée" });
}