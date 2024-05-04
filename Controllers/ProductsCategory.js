const ProductsCategory = require("../Models/ProductsCategory");
const MCategory = require("../Models/MCategory");
const moment = require("moment");

exports.createOneCategory = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: true, message: "Champs invalides" });
    }
    const now = moment();
    const toInsert = {
      name: req.body.name,
      timestamp: now.unix(),
    };
    
    const inserted = await ProductsCategory.insertOne(toInsert);

    if (req.body.createMC === "oui") {
      await MCategory.insertOne({ name: `Achat ${req.body.name}`, type: "outlet", pCategoryId: inserted.insertId, });
    }

    const categories = await ProductsCategory.findAll();
    
    return res.status(200).json({ success: true, message: "Catégorie créée", categories });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.updateOneCategory = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: true, message: "Champs invalides" });
    }
    const toSet = {
      name: req.body.name,
    }
    await ProductsCategory.update(toSet, { id: req.params.id });
    const categories = await ProductsCategory.findAll();
    return res.status(200).json({ success: true, message: "Catégorie modifiée", categories });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.deleteOneCategory = async (req, res) => {
  try {
    await ProductsCategory.delete({ id: req.params.id });
    const mcCheck = await MCategory.find({ pCategoryId: req.params.id });
    if (mcCheck.length > 0) {
      await MCategory.delete({ pCategoryId: req.params.id });
    }
    const categories = await ProductsCategory.findAll();
    return res.status(200).json({ success: true, message: "Catégorie supprimée", categories });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.getOneCategory = async (req, res) => {
  try {
    const category = await ProductsCategory.find({ id: req.params.id });
    return res.status(200).json({ success: true, data: category[0], });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.getAllCategory = async (req, res) => {
  try {
    const category = await ProductsCategory.findAll();
    return res.status(200).json({ success: true, data: category, });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}