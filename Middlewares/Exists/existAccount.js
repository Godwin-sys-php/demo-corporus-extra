const MAccount = require("../../Models/MAccount");

module.exports = async (req, res, next) => {
  try {
    const account = await MAccount.find({ id: req.params.id });
    if (account.length === 0) {
      return res.status(404).json({ cannott: true, message: "Compte inconnu" });
    }
    req._account = account[0];
    return next();
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}