const ProductsCategory = require("../../Models/ProductsCategory");

module.exports = async (req, res, next) => {
  try {
    const category = await ProductsCategory.find({ id: req.params.id });
    if (category.length === 0) {
      return res.status(404).json({ cannott: true, message: "Catégorie inconnue" });
    }
    req._pCategory = category[0];
    return next();
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}