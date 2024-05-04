const Users = require("../Models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
require("dotenv").config();

exports.login = async (req, res) => {
  try {
    console.log("mobigo");
    const user = await Users.find({ username: req.body.username });
    if (user.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: "Utilisateur inconnu" });
    }
    const password = await bcrypt.compare(req.body.password, user[0].password);
    if (!password) {
      return res
        .status(403)
        .json({ error: true, message: "Mot de passe incorrect" });
    }
    const token = jwt.sign({ ...user[0] }, process.env.JWT_SECRET, {
      expiresIn: "200h",
    });
    return res
      .status(200)
      .json({ success: true, token, userData: { ...user[0], password: null } });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const now = moment()
    const toInsert = {
      name: req.body.name,
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 10),
      type: req.body.type,
      timestamp: now.unix(),
    }

    await Users.insertOne(toInsert);
    const users = await Users.findAll();

    return res.status(200).json({ success: true, users ,message: "Utilisateur créé" });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.deleteOneUser = async (req, res) => {
  try {
    const users = await Users.find({ type: "admin", });
    if (req.params.id == req.user.id) {
      return res.status(403).json({ error: true, message: "Impossible de supprimer son propre compte" });
    }
    if (users.length === 1 && users[0].id == req.params.id) {
      return res.status(403).json({ error: true, message: "Impossible de supprimer le dernier administrateur" });
    }
    await Users.delete({ id: req.params.id });
    const usersToShow = await Users.findAll();
    return res.status(200).json({ success: true, message: "Utilisateur supprimé", data: usersToShow, });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.updateOneUser = async (req, res) => {
  try {
    if (!req.body.name || !req.body.type || !["admin", "manager", "serveur"].includes(req.body.type)) {
      return res.status(400).json({ error: true, message: "Champs invalides" });
    }
    const toSet = {
      name: req.body.name,
      type: req.body.type,
    }
    await Users.update(toSet, { id: req.params.id });
    const users = await Users.findAll();
    return res.status(200).json({ success: true, message: "Utilisateur modifié", users, });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll();
    return res.status(200).json({ success: true, data: users, });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.getOneUser = async (req, res) => {
  try {
    const user = await Users.find({ id: req.params.id });
    return res.status(200).json({ success: true, data: user[0], });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}