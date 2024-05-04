const jwt = require("jsonwebtoken");
const Users = require("../../Models/Users");

const authUser = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => { 
      if (err) {
        return res.status(403).json({ error: true, message: "Token invalide" });
      }
      const user = await Users.find({ id: decoded.id });
      if (user.length === 0) {
        return res.status(404).json({ invalidToken: true, message: "Utilisateur inconnu" });
      }
      req.user = user[0];
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }

};

module.exports = authUser;