const MCategory = require("../Models/MCategory");

exports.createOneMCategory = async (req, res) => {
  try {
    const check = await MCategory.find({ name: req.body.name });
    if (
      check.length ||
      req.body.name === "" ||
      (req.body.type !== "enter" && req.body.type !== "outlet")
    ) {
      return res
        .status(400)
        .json({ error: true, message: "Cette catégorie existe déjà" });
    }
    const toInsert = {
      name: req.body.name,
      type: req.body.type,
    };

    await MCategory.insertOne(toInsert);
    const categories = await MCategory.findAll();
    return res
      .status(200)
      .json({ success: true, message: "Catégorie créée", categories });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};

exports.updateOneMCategory = async (req, res) => {
  try {
    if (req._mCategory.cannotDelete === 1 || req._mCategory.defaultForSell === 1 || req._mCategory.defaultForBuy === 1 || req._mCategory.isSystem === 1) {
      return res.status(400).json({ error: true, message: "Vous ne pouvez pas modifier cette catégorie" });
    }
    const check = await MCategory.customQuery("SELECT * FROM mCategory WHERE name = ? AND id != ?", [req.body.name, req.params.id]);
    if (
      check.length ||
      req.body.name === "" ||
      (req.body.type !== "enter" && req.body.type !== "outlet")
    ) {
      return res
        .status(400)
        .json({ error: true, message: "Cette catégorie existe déjà" });
    }
    const toSet = {
      name: req.body.name,
      type: req.body.type,
    };
    await MCategory.update(toSet, { id: req.params.id });
    const categories = await MCategory.findAll();
    return res
      .status(200)
      .json({ success: true, message: "Catégorie modifiée", categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.deleteOneMCategory = async (req, res) => {
  try {
    if (req._mCategory.cannotDelete === 1 || req._mCategory.defaultForSell === 1 || req._mCategory.defaultForBuy === 1 || req._mCategory.isSystem === 1) {
      return res.status(400).json({ error: true, message: "Vous ne pouvez pas supprimer cette catégorie" });
    }
    await MCategory.delete({ id: req.params.id });
    const categories = await MCategory.findAll();
    return res.status(200).json({ success: true, message: "Catégorie supprimée", categories });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.getAll = async (req, res) => {
  try {
    const categories = await MCategory.findAll();
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.getCategoriesForEnter = async (req, res) => {
  try {
    const categories = await MCategory.find({ type: "enter" });
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.getCategoriesForOutlet = async (req, res) => {
  try {
    const categories = await MCategory.find({ type: "outlet" });
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}