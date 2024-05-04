const Clients = require("../Models/Clients");
const moment = require("moment");
const Debts = require("../Models/Debts");
const MAccount = require("../Models/MAccount");
const MCategory = require("../Models/MCategory");
const MTransactions = require("../Models/MTransactions");

exports.createOneClient = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: true, message: "Champs invalides" });
    }
    const now = moment();
    const toInsert = {
      name: req.body.name,
      timestamp: now.unix(),
    };
    
    await Clients.insertOne(toInsert);
    const clients = await Clients.findAll();
    
    return res.status(200).json({ success: true, message: "Client créé", clients });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.updateOneClient = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: true, message: "Champs invalides" });
    }
    const toSet = {
      name: req.body.name,
    }
    await Clients.update(toSet, { id: req.params.id });
    const clients = await Clients.findAll();
    return res.status(200).json({ success: true, message: "Client modifié", clients });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.deleteOneClient = async (req, res) => {
  try {
    if (req._client.debt > 0) {
      return res.status(400).json({ error: true, message: "Le client a une dette" });
    }
    await Clients.delete({ id: req.params.id });
    const clients = await Clients.findAll();
    return res.status(200).json({ success: true, message: "Client supprimé", clients });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.getOneClient = async (req, res) => {
  try {
    const client = await Clients.find({ id: req.params.id });
    const debts = await Debts.find({ clientId: req.params.id });
    const accounts = await MAccount.findAll();

    return res.status(200).json({ success: true, data: client[0], debts, accounts, });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.addDebt = async (req, res) => {
  try {
    const now = moment();

    const toInsertDebt = {
      userId: req.user.id,
      clientId: req._client.id,
      sessionId: null,
      accountId: null,
      userName: req.user.name,
      clientName: req._client.name,
      enter: req.body.amount,
      outlet: 0,
      note: req.body.note,
      timestamp: now.unix(),
    };

    await Debts.insertOne(toInsertDebt);
    await Clients.update({ debt: req._client.debt + req.body.amount, }, { id: req._client.id });
    
    const debts = await Debts.find({ clientId: req._client.id });
    const client = await Clients.find({ id: req._client.id });

    return res.status(200).json({ success: true, message: "Dette ajoutée", debts, client: client[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.payDebt = async (req, res) => {
  try {
    const now = moment();

    if (Number(req.body.amount) > req._client.debt) {
      return res.status(400).json({ error: true, message: "Montant supérieur à la dette" });
    }

    const mCategory = await MCategory.find({ id: 3, });
    const account = await MAccount.find({ id: req.body.accountId });

    console.log(mCategory);
    console.log(account);

    if (mCategory.length < 1 || account.length < 1) {
      return res.status(400).json({ error: true, message: "Catégorie ou compte non trouvés" });
    }

    const toInsertDebt = {
      userId: req.user.id,
      clientId: req._client.id,
      sessionId: null,
      accountId: account[0].id,
      accountName: account[0].name,
      userName: req.user.name,
      clientName: req._client.name,
      enter: 0,
      outlet: Number(req.body.amount),
      note: req.body.note,
      timestamp: now.unix(),
    };

    const toInsertMTransaction = {
      categoryId: mCategory[0].id,
      accountId: account[0].id,
      userId: req.user.id,
      categoryName: mCategory[0].name,
      userName: req.user.name,
      accountName: account[0].name,
      enter: Number(req.body.amount),
      outlet: 0,
      after: account[0].amount + Number(req.body.amount),
      description: req.body.note,
      timestamp: now.unix(),
    }

    await Debts.insertOne(toInsertDebt);
    await MTransactions.insertOne(toInsertMTransaction);
    await Clients.update({ debt: req._client.debt - req.body.amount, }, { id: req._client.id });
    await MAccount.update({ amount: account[0].amount + Number(req.body.amount), }, { id: account[0].id });

    const debts = await Debts.find({ clientId: req._client.id });
    const client = await Clients.find({ id: req._client.id });

    return res.status(200).json({ success: true, message: "Dette payée", debts, client: client[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Clients.findAll();
    return res.status(200).json({ success: true, data: clients, });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}