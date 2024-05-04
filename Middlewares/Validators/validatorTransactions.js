const Products = require("../../Models/Products");
const PTCategory = require("../../Models/PTCategory");

module.exports = async (req, res, next) => {
  const isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };
  try {
    if (
      !req.body.productId ||
      !req.body.quantity ||
      !req.body.description ||
      !req.body.categoryId ||
      !isNumber(req.body.quantity)
    ) {
      return res.status(400).json({ error: true, message: "Champs invalides" });
    }
    const checkProduct = await Products.find({ id: req.body.productId });
    if (checkProduct.length === 0) {
      return res
        .status(400)
        .json({ error: true, message: "Produit introuvable" });
    }
    const checkCategory = await PTCategory.find({ id: req.body.categoryId });
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
    if (req.body.quantity < 0) {
      return res
        .status(400)
        .json({ error: true, message: "Quantité invalide" });
    }
    req._product = checkProduct[0];
    req._ptCategory = checkCategory[0];
    return next();
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};
