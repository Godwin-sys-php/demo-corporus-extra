const ProductsCategory = require("../../Models/ProductsCategory");
const Products = require("../../Models/Products");

module.exports = async (req, res, next) => {
  try {
    const isNumber = (value) => {
      return !isNaN(parseFloat(value)) && isFinite(value);
    }
    const isBoolean = (value) => {
      return value === true || value === false;
    }
    const {
      name,
      categoryId,
      unit,
      isSellable,
      isVersatile,
      price,
      inStock,
      buyPrice,
      hasLink,
    } = req.body;
    if (!isBoolean(isSellable) || !isBoolean(isVersatile) || !isBoolean(hasLink)) {
      return res.status(400).json({ error: true, message: "Champs invalides" });
    }
    if (hasLink) {
      if (!name || !categoryId || !unit || !isNumber(price) || !req.body.links) {
        return res.status(400).json({ error: true, message: "Champs invalides" })
      } else {
        const category = await ProductsCategory.find({ id: categoryId });
        if (category.length === 0) {
          return res.status(400).json({ error: true, message: "Catégorie invalide" });
        }
        for (let index in req.body.links) {
          const product = await Products.find({ id: req.body.links[index].id, });
          if (!isNumber(req.body.links[index].quantity)) {
            return res.status(400).json({ error: true, message: "Champs invalides" });
          }
          if (product.length === 0) {
            return res.status(400).json({ error: true, message: "Produit invalide" });
          }
          if (product[0].isVersatile === true) {
            return res.status(400).json({ error: true, message: "Produit invalide" });
          }
        }
        req.body.inStock = null;
        req.body.buyPrice = null;
        req.body.isVersatile = true;
        req.body.isSellable = true;
        req._pCategory = category[0];
        return next();
      }
    }
    if (isSellable) {
      if (isVersatile) {
        if (!name || !categoryId || !unit || !isNumber(price) || !isNumber(buyPrice)) {
          return res.status(400).json({ error: true, message: "Champs invalides" })
        } else {
          const category = await ProductsCategory.find({ id: categoryId });
          if (category.length === 0) {
            return res.status(400).json({ error: true, message: "Catégorie invalide" });
          }
          req.body.inStock = null;
          req._pCategory = category[0];
          return next();
        }
      } else {
        if (!name || !categoryId || !unit || !isNumber(price) || !isNumber(buyPrice) || !isNumber(inStock)) {
          return res.status(400).json({ error: true, message: "Champs invalides" })
        } else {
          const category = await ProductsCategory.find({ id: categoryId });
          if (category.length === 0) {
            return res.status(400).json({ error: true, message: "Catégorie invalide" });
          }
          req._pCategory = category[0];
          return next();
        }
      }
    } else {
      if (isVersatile) {
        if (!name || !categoryId || !unit || !isNumber(buyPrice)) {
          return res.status(400).json({ error: true, message: "Champs invalides" })
        } else {
          const category = await ProductsCategory.find({ id: categoryId });
          if (category.length === 0) {
            return res.status(400).json({ error: true, message: "Catégorie invalide" });
          }
          req.body.inStock = null;
          req.body.price = null;
          req._pCategory = category[0];
          return next();
        }
      } else {
        if (!name || !categoryId || !unit || !isNumber(buyPrice) || !isNumber(inStock)) {
          return res.status(400).json({ error: true, message: "Champs invalides" })
        } else {
          const category = await ProductsCategory.find({ id: categoryId });
          if (category.length === 0) {
            return res.status(400).json({ error: true, message: "Catégorie invalide" });
          }
          req.body.price = null;
          req._pCategory = category[0];
          return next();
        }
      }
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}