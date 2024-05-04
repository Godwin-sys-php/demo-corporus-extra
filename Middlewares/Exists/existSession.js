const Sessions = require("../../Models/Sessions");

module.exports = async (req, res, next) => {
  try {
    const session = await Sessions.find({ id: req.params.id });
    if (session.length === 0) {
      return res.status(404).json({ cannott: true, message: "Session inexistante" });
    }
    req._session = session[0];
    return next();
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}