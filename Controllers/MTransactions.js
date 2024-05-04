const MAccount = require("../Models/MAccount");
const MTransactions = require("../Models/MTransactions");
const moment = require("moment");

exports.createEnter = async (req, res) => {
  try {
    const now = moment();
    const toInsert = {
      categoryId: req._mCategory.id,
      accountId: req._mAccount.id,
      userId: req.user.id,
      categoryName: req._mCategory.name,
      userName: req.user.name,
      accountName: req._mAccount.name,
      enter: Number(req.body.amount),
      outlet: 0,
      after: req._mAccount.amount + Number(req.body.amount),
      description: req.body.description,
      timestamp: now.unix(),
    };
    await MTransactions.insertOne(toInsert);
    await MAccount.update({ amount: toInsert.after }, { id: req._mAccount.id });
    const mCategory = await MTransactions.customQuery("SELECT * FROM mCategory WHERE isSystem = 0");
    const accounts = await MTransactions.customQuery("SELECT * FROM mAccount");
    return res.status(200).json({
      success: true,
      message: "Entrée créée",
      data: { mCategory, accounts },
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
    const now = moment();
    if (req._mAccount.amount - Number(req.body.amount) < 0) {
      return res
        .status(400)
        .json({ error: true, message: "Vous n'avez pas assez de liquidité pour effectuer la transaction" });
    }
    const toInsert = {
      categoryId: req._mCategory.id,
      userId: req.user.id,
      accountId: req._mAccount.id,
      categoryName: req._mCategory.name,
      userName: req.user.name,
      accountName: req._mAccount.name,
      enter: 0,
      outlet: Number(req.body.amount),
      after: req._mAccount.amount - Number(req.body.amount),
      description: req.body.description,
      timestamp: now.unix(),
    };
    await MTransactions.insertOne(toInsert);
    await MAccount.update({ amount: toInsert.after }, { id: req._mAccount.id });
    const mCategory = await MTransactions.customQuery("SELECT * FROM mCategory WHERE isSystem = 0");
    const accounts = await MTransactions.customQuery("SELECT * FROM mAccount");
    return res.status(200).json({
      success: true,
      message: "Sortie créée",
      data: { mCategory, accounts },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};

exports.getPrerequisities = async (req, res) => {
  try {
    const mCategory = await MTransactions.customQuery("SELECT * FROM mCategory WHERE isSystem = 0");
    const accounts = await MTransactions.customQuery("SELECT * FROM mAccount");

    return res
      .status(200)
      .json({ success: true, data: { mCategory, accounts, } });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};

exports.getTransactionsOnPeriod = async (req, res) => {
  try {
    const transactions = await MTransactions.customQuery(
      "SELECT * FROM mTransactions WHERE timestamp >= ? AND timestamp <= ?",
      [req.params.start, req.params.end]
    );
    const mCategory = await MTransactions.customQuery("SELECT * FROM mCategory WHERE isSystem = 0");
    const accounts = await MTransactions.customQuery("SELECT * FROM mAccount");

    return res.status(200).json({
      success: true,
      transactions,
      data: { mCategory, accounts, },
      start: req.params.start,
      end: req.params.end,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};
