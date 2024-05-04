const MAccount = require("../Models/MAccount");
const moment = require("moment");

exports.createOneAccount = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: true, message: "Champs invalides" });
    }
    const now = moment();
    const toInsert = {
      name: req.body.name,
      amount: 0,
    };
    
    await MAccount.insertOne(toInsert);
    const accounts = await MAccount.findAll();
    
    return res.status(200).json({ success: true, message: "Compte de paiement créé", accounts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.updateOneAccount = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: true, message: "Champs invalides" });
    }
    const toSet = {
      name: req.body.name,
    }
    await MAccount.update(toSet, { id: req.params.id });
    const accounts = await MAccount.findAll();
    return res.status(200).json({ success: true, message: "Compte modifié", accounts });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.deleteOneAccount = async (req, res) => {
  try {
    await MAccount.delete({ id: req.params.id });
    const accounts = await MAccount.findAll();
    return res.status(200).json({ success: true, message: "Compte supprimé", accounts });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.getOneAccount = async (req, res) => {
  try {
    const account = await MAccount.find({ id: req.params.id });
    return res.status(200).json({ success: true, data: account[0], });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.getAllAccount = async (req, res) => {
  try {
    const accounts = await MAccount.findAll();
    return res.status(200).json({ success: true, data: accounts, });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}