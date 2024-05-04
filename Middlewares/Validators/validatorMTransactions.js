const MCategory = require("../../Models/MCategory");
const MAccount = require("../../Models/MAccount");

module.exports = async (req, res, next) => {
  const isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };
  console.log(req.body);
  try {
    if (
      !req.body.amount ||
      !req.body.description ||
      !req.body.categoryId ||
      !isNumber(req.body.amount)
    ) {
      return res.status(400).json({ error: true, message: "Champs invalides" });
    }
    const checkCategory = await MCategory.find({ id: req.body.categoryId });
    const checkAccount = await MAccount.find({ id: req.body.accountId });
    if (checkAccount.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "Compte introuvable" });
    }
    if (checkCategory.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "Catégorie introuvable" });
    }
    if (req.baseUrl === "/enter" && checkCategory[0].type === "outlet") {
      return res
        .status(400)
        .json({ error: true, message: "Vous ne pouvez pas entrer de transaction pour une catégorie de sortie" });
    }
    if (req.baseUrl === "/outlet" && checkCategory[0].type === "enter") {
      return res
        .status(400)
        .json({ error: true, message: "Vous ne pouvez pas sortir de transaction pour une catégorie d'entrée" });
    }
    if (req.body.amount < 0) {
      return res
        .status(400)
        .json({ error: true, message: "Montant invalide" });
    }
    req._mAccount = checkAccount[0];
    req._mCategory = checkCategory[0];
    return next();
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};
