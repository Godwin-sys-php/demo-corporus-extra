const Products = require("../Models/Products");
const ProductsCategory = require("../Models/ProductsCategory");
const Transactions = require("../Models/Transactions");
const PTCategory = require("../Models/PTCategory");
const moment = require("moment");

exports.createOneProduct = async (req, res) => {
  try {
  const toInsert = {
    categoryId: req._pCategory.id,
    categoryName: req._pCategory.name,
    name: req.body.name,
    unit: req.body.unit,
    isSellable: req.body.isSellable,
    isVersatile: req.body.isVersatile,
    price: req.body.price,
    buyPrice: req.body.buyPrice,
    inStock: req.body.inStock,
    timestamp: moment().unix(),
  };
  
  const inserted = await Products.insertOne(toInsert);

  const category = await PTCategory.find({ id: 2, });


  if (req.body.inStock >= 0 && !req.body.isVersatile) {

    const toInsertTransactions = {
      categoryId: 2,
      productId: inserted.insertId,
      userId: req.user.id,
      categoryName: category[0].name,
      productName: req.body.name,
      userName: req.user.name,
      enter: req.body.inStock,
      outlet: 0,
      after: req.body.inStock,
      description: `Création du produit ${req.body.name}`,
      timestamp: moment().unix(),
    }
    
    await Transactions.insertOne(toInsertTransactions);
  }

  const products = await Products.findAll();
  const categories = await ProductsCategory.findAll();

  return res.status(200).json({ success: true, message: "Produit créé", products, categories }); 
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};

exports.updateOneProduct = async (req, res) => {
  try {
    let toSet = {
      categoryId: req._pCategory.id,
      categoryName: req._pCategory.name,
      name: req.body.name,
      unit: req.body.unit,
      isSellable: req.body.isSellable,
      isVersatile: req.body.isVersatile,
      price: req.body.price,
      buyPrice: req.body.buyPrice,
    };

    console.log(req._product);

    if ((req._product.inStock === 0 || req._product.inStock === null) && toSet.isVersatile === false) {
      toSet.inStock = 0;
    }
    if (toSet.isVersatile === true && (req._product.inStock !== 0 || req._product.inStock !== null)) {
      toSet.inStock = null;
    }

    await Products.update(toSet, { id: req.params.id });

    const products = await Products.findAll();
    const categories = await ProductsCategory.findAll();

    return res.status(200).json({ success: true, message: "Produit modifié", products, categories });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" }); 
  }
}

exports.deleteOneProduct = async (req, res) => {
  try {
    await Products.delete({ id: req.params.id });

    const products = await Products.findAll();
    const categories = await ProductsCategory.findAll();
    if (req._product.inStock > 0 && req._product.isVersatile === 0) {
      const category = await PTCategory.find({ id: 3, });
      const toInsertTransactions = {
        categoryId: 3,
        productId: req.params.id,
        userId: req.user.id,
        categoryName: category[0].name,
        productName: req._product.name,
        userName: req.user.name,
        enter: 0,
        outlet: req._product.inStock,
        after: 0,
        description: `Suppression du produit ${req._product.name}`,
        timestamp: moment().unix(),
      }

      await Transactions.insertOne(toInsertTransactions);
    }

    return res.status(200).json({ success: true, message: "Produit supprimé", products, categories });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" }); 
  }
}

exports.getOneProduct = async (req, res) => {
  try {
    const product = await Products.find({ id: req.params.id });
    return res.status(200).json({ success: true, data: product[0], });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu"});
  }
}

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Products.findAll();
    const categories = await ProductsCategory.findAll();
    return res.status(200).json({ success: true, data: products, categories, });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu"});
  }
}

exports.getSellableProducts = async (req, res) => {
  try {
    const products = await Products.find({ isSellable: true });
    return res.status(200).json({ success: true, data: products, });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu"});
  }
}

exports.getVersatile = async (req, res) => {
  try {
    const products = await Products.find({ isVersatile: true });
    return res.status(200).json({ success: true, data: products, });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu"});
  }
}

exports.getNotVersatile = async (req, res) => {
  try {
    const products = await Products.customQuery("SELECT * FROM products WHERE isVersatile = 0 ORDER BY depotStock DESC");
    return res.status(200).json({ success: true, data: products, });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu"});
  }
}

exports.getAllProductsByCategory = async (req, res) => {
  try {
    const products = await Products.find({ categoryId: req.params.id });
    return res.status(200).json({ success: true, data: products, });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu"});
  }
}
