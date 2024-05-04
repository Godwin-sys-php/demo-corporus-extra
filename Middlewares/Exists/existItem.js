const SessionItems = require("../../Models/SessionItems");
const Products = require("../../Models/Products");

module.exports = async (req, res, next) => {
  try {
    const item = await SessionItems.find({ id: req.params.idItem });
    if (item.length === 0) {
      return res.status(404).json({ cannott: true, message: "Element inexistant" });
    }
    const product = await Products.find({ id: item[0].productId });
    if (product.length === 0) {
      return res.status(404).json({ cannott: true, message: "Produit inexistant" });
    }
    req._item = item[0];
    req._product = product[0];
    return next();
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}