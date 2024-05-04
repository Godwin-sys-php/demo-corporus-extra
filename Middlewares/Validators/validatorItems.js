const Products = require('../../Models/Products');

const validatorItems = async (req, res, next) => {
  try {
    if (!req.body.productId && req.body.quantity) {
      return res.status(400).json({ error: true, message: "Champs invalides" });
    }
    const product = await Products.find({ id: req.body.productId });
    if (product.length === 0) {
      return res.status(400).json({ error: true, message: "Produit inexistant" });
    }
    req._product = product[0];
    return next();
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu", });
  }
}

module.exports = validatorItems;