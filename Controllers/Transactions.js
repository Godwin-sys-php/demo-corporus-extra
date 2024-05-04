const Products = require("../Models/Products");
const Transactions = require("../Models/Transactions");
const MTransactions = require("../Models/MTransactions");
const moment = require("moment");
const MCategory = require("../Models/MCategory");
const MAccount = require("../Models/MAccount");

exports.createEnter = async (req, res) => {
  try {
    const accountData = await MAccount.find({ id: 1, });
    let account = accountData[0];
    if (req.body.makeMoneyTransaction === "oui") {
      const totalPrice = Number(req.body.quantity) * Number(req.body.buyPrice);
      if (account.amount - totalPrice < 0) {
        return res
          .status(400)
          .json({ error: true, message: "Vous n'avez pas assez de liquidité pour effectuer la transaction" });
      }
    }
    if (req._product.isVersatile === 1) {
      return res.status(400).json({
        error: true,
        message:
          "Vous ne pouvez pas entrer de transaction pour un produit versatile",
      });
    }
    const now = moment();
    const toInsert = {
      categoryId: req._ptCategory.id,
      productId: req._product.id,
      userId: req.user.id,
      categoryName: req._ptCategory.name,
      productName: req._product.name,
      userName: req.user.name,
      enter: Number(req.body.quantity),
      outlet: 0,
      after: req._product.inStock + Number(req.body.quantity),
      description: req.body.description,
      timestamp: now.unix(),
    };
    const inserted = await Transactions.insertOne(toInsert);
    await Products.update({ inStock: Number(req._product.inStock) + Number(req.body.quantity)}, { id: req._product.id });


    if (req.body.makeMoneyTransaction === "oui") {
      const totalPrice = Number(req.body.quantity) * Number(req.body.buyPrice);
      const checkCategory = await MCategory.customQuery("SELECT * FROM mCategory WHERE pCategoryId = ?", [req._product.categoryId]);
      const defaultCategory = await MCategory.find({ id: 2 });
      const toInsert = {
        userId: req.user.id,
        userName: req.user.name,
        categoryId: checkCategory.length > 0 ? checkCategory[0].id : 2,
        categoryName: checkCategory.length > 0 ? checkCategory[0].name : defaultCategory[0].name,
        transactionId: inserted.insertId,
        accountId: 1,
        accountName: account.name,
        enter: 0,
        outlet: totalPrice,
        after: Number(account.amount) - totalPrice,
        description: `Achat de ${req._product.name}; Quantité: ${req.body.quantity}; Prix: ${req.body.buyPrice}$`,
        timestamp: now.unix(),
      };
      await MTransactions.insertOne(toInsert);
    }


    const products = await Transactions.customQuery("SELECT * FROM products WHERE isVersatile = 0");
    const ptCategory = await Transactions.customQuery(
      "SELECT * FROM ptCategory WHERE isSystem = 0"
    );
    return res.status(200).json({
      success: true,
      message: "Entrée créée",
      data: { products, ptCategory },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};

exports.createOutlet = async (req, res) => {
  try {
    if (req._product.isVersatile === 1) {
      return res.status(400).json({
        error: true,
        message:
          "Vous ne pouvez pas sortir de transaction pour un produit versatile",
      });
    }
    if (req._product.inStock - Number(req.body.quantity) < 0) {
      return res.status(400).json({
        error: true,
        message:
          "Vous ne pouvez pas sortir plus de produits que ce que vous avez en stock",
      });
    }
    const now = moment();
    const toInsert = {
      categoryId: req._ptCategory.id,
      productId: req._product.id,
      userId: req.user.id,
      categoryName: req._ptCategory.name,
      productName: req._product.name,
      userName: req.user.name,
      enter: 0,
      outlet: Number(req.body.quantity),
      after: req._product.inStock - Number(req.body.quantity),
      description: req.body.description,
      timestamp: now.unix(),
    };
    await Transactions.insertOne(toInsert);
    await Products.update({ inStock: Number(req._product.inStock) - Number(req.body.quantity)}, { id: req._product.id });
    const products = await Transactions.customQuery("SELECT * FROM products WHERE isVersatile = 0");
    const ptCategory = await Transactions.customQuery(
      "SELECT * FROM ptCategory WHERE isSystem = 0"
    );
    return res.status(200).json({
      success: true,
      message: "Sortie créée",
      data: { products, ptCategory },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};

exports.getPrerequisities = async (req, res) => {
  try {
    const products = await Transactions.customQuery("SELECT * FROM products WHERE isVersatile = 0");
    const ptCategory = await Transactions.customQuery(
      "SELECT * FROM ptCategory WHERE isSystem = 0"
    );

    return res
      .status(200)
      .json({ success: true, data: { products, ptCategory } });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};

exports.getTransactionsOnPeriod = async (req, res) => {
  try {
    const transactions = await Transactions.customQuery(
      "SELECT * FROM transactions WHERE timestamp >= ? AND timestamp <= ?",
      [req.params.start, req.params.end]
    );
    const products = await Transactions.customQuery("SELECT * FROM products WHERE isVersatile = 0");
    const ptCategory = await Transactions.customQuery(
      "SELECT * FROM ptCategory WHERE isSystem = 0"
    );

    return res.status(200).json({
      success: true,
      transactions,
      data: { products, ptCategory },
      start: req.params.start,
      end: req.params.end,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};
