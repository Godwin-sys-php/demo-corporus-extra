const Users = require("../../Models/Users");

module.exports = async (req, res, next) => {
  try {
    const user = await Users.find({ id: req.params.id });
    if (user.length === 0) {
      return res.status(404).json({ cannott: true, message: "Utilisateur inconnu" });
    }
    req._user = user[0];
    return next();
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}