const Products = require("../../Models/Products");

module.exports = async (req, res, next) => {
  try {
    const product = await Products.find({ id: req.params.id });
    if (product.length === 0) {
      return res.status(404).json({ cannott: true, message: "Produit inconnu" });
    }
    req._product = product[0];
    return next();
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}