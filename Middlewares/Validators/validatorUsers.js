const Users = require("../../Models/Users");

module.exports = async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.name || !req.body.password || !["admin", "manager", "serveur"].includes(req.body.type)) {
      return res.status(400).json({ error: true, message: "Champs invalides" });
    }
    const checkUsername = await Users.find({ username: req.body.username });
    if (checkUsername.length > 0) {
      return res.status(400).json({ error: true, message: "Nom d'utilisateur déjà utilisé" });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}