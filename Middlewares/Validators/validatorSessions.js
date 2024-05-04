const Clients = require('../../Models/Clients');

const validatorSessions = async (req, res, next) => {
  try {
    if (!req.body.clientId) {
     return res.status(400).json({ error: true, message: "Champs invalides" }); 
    }
    if (!req.body.fromMobile && !req.body.serverName) {
      return res.status(400).json({ error: true, message: "Champs invalides" });
    }
    const client = await Clients.find({ id: req.body.clientId });
    if (client.length === 0) {
      return res.status(400).json({ error: true, message: "Client inexistant" });
    }
    req._client = client[0];
    return next();
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu", });
  }
}

module.exports = validatorSessions;