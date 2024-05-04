const Clients = require("../../Models/Clients");

module.exports = async (req, res, next) => {
  try {
    const client = await Clients.find({ id: req.params.id });
    if (client.length === 0) {
      return res.status(404).json({ cannott: true, message: "Utilisateur inconnu" });
    }
    req._client = client[0];
    return next();
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}