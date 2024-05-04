const Products = require("../Models/Products");
const DTransactions = require("../Models/DTransactions");
const MTransactions = require("../Models/MTransactions");
const moment = require("moment");
const MCategory = require("../Models/MCategory");
const MAccount = require("../Models/MAccount");
const PTCategory = require("../Models/PTCategory");
const Transactions = require("../Models/Transactions");

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
      after: req._product.depotStock + Number(req.body.quantity),
      description: req.body.description,
      timestamp: now.unix(),
    };
    const inserted = await DTransactions.insertOne(toInsert);
    await Products.update({ depotStock: Number(req._product.depotStock) + Number(req.body.quantity)}, { id: req._product.id });


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


    const products = await DTransactions.customQuery("SELECT * FROM products WHERE isVersatile = 0");
    const ptCategory = await DTransactions.customQuery(
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
    if (req._product.depotStock - Number(req.body.quantity) < 0) {
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
      after: req._product.depotStock - Number(req.body.quantity),
      description: req.body.description,
      timestamp: now.unix(),
    };
    await DTransactions.insertOne(toInsert);
    await Products.update({ depotStock: Number(req._product.depotStock) - Number(req.body.quantity)}, { id: req._product.id });
    const products = await DTransactions.customQuery("SELECT * FROM products WHERE isVersatile = 0");
    const ptCategory = await DTransactions.customQuery(
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

exports.transferToBar = async (req, res) => {
  try {
    const product = await Products.find({ id: req.body.productId });
    if (product.length === 0) {
      return res.status(400).json({ error: true, message: "Produit inexistant" });
    }
    req._product = product[0];
    if (req._product.isVersatile === 1) {
      return res.status(400).json({
        error: true,
        message:
          "Vous ne pouvez pas sortir de transaction pour un produit versatile",
      });
    }
    if (req._product.depotStock - Number(req.body.quantity) < 0) {
      return res.status(400).json({
        error: true,
        message:
          "Vous ne pouvez pas sortir plus de produits que ce que vous avez en stock",
      });
    }
    const now = moment();
    const categoryTransfer = await PTCategory.find({ id: 5 });
    const categoryReception = await PTCategory.find({ id: 6 });

    const toInsert1 = {
      categoryId: categoryTransfer[0].id,
      productId: req._product.id,
      userId: req.user.id,
      categoryName: categoryTransfer[0].name,
      productName: req._product.name,
      userName: req.user.name,
      enter: 0,
      outlet: Number(req.body.quantity),
      after: req._product.depotStock - Number(req.body.quantity),
      description: "Transfert vers bars",
      timestamp: now.unix(),
    };

    const toInsert2 = {
      categoryId: categoryReception[0].id,
      productId: req._product.id,
      userId: req.user.id,
      categoryName: categoryReception[0].name,
      productName: req._product.name,
      userName: req.user.name,
      enter: Number(req.body.quantity),
      outlet: 0,
      after: req._product.inStock - Number(req.body.quantity),
      description: "Reception depuis dépot",
      timestamp: now.unix(),
    }

    await DTransactions.insertOne(toInsert1);
    await Transactions.insertOne(toInsert2);
    await Products.update({ depotStock: Number(req._product.depotStock) - Number(req.body.quantity), inStock: Number(req._product.inStock) + Number(req.body.quantity)}, { id: req._product.id });


    const products = await DTransactions.customQuery("SELECT * FROM products WHERE isVersatile = 0");
    const ptCategory = await DTransactions.customQuery(
      "SELECT * FROM ptCategory WHERE isSystem = 0"
    );
    return res.status(200).json({
      success: true,
      message: "Sortie créée",
      data: { products, ptCategory },
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });   
  }
}

exports.getPrerequisities = async (req, res) => {
  try {
    const products = await DTransactions.customQuery("SELECT * FROM products WHERE isVersatile = 0");
    const ptCategory = await DTransactions.customQuery(
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
    const transactions = await DTransactions.customQuery(
      "SELECT * FROM dTransactions WHERE timestamp >= ? AND timestamp <= ?",
      [req.params.start, req.params.end]
    );
    const products = await DTransactions.customQuery("SELECT * FROM products WHERE isVersatile = 0");
    const ptCategory = await DTransactions.customQuery(
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
