const PTCategory = require("../Models/PTCategory");

exports.createOnePTCategory = async (req, res) => {
  try {
    const check = await PTCategory.find({ name: req.body.name });
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

    await PTCategory.insertOne(toInsert);
    const categories = await PTCategory.findAll();
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

exports.updateOnePTCategory = async (req, res) => {
  try {
    if (req._ptCategory.cannotDelete === 1 || req._ptCategory.defaultForSell === 1 || req._ptCategory.defaultForBuy === 1 || req._ptCategory.isSystem === 1) {
      return res.status(400).json({ error: true, message: "Vous ne pouvez pas modifier cette catégorie" });
    }
    const check = await PTCategory.customQuery("SELECT * FROM ptCategory WHERE name = ? AND id != ?", [req.body.name, req.params.id]);
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
    await PTCategory.update(toSet, { id: req.params.id });
    const categories = await PTCategory.findAll();
    return res
      .status(200)
      .json({ success: true, message: "Catégorie modifiée", categories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.deleteOnePTCategory = async (req, res) => {
  try {
    if (req._ptCategory.cannotDelete === 1 || req._ptCategory.defaultForSell === 1 || req._ptCategory.defaultForBuy === 1 || req._ptCategory.isSystem === 1) {
      return res.status(400).json({ error: true, message: "Vous ne pouvez pas supprimer cette catégorie" });
    }
    await PTCategory.delete({ id: req.params.id });
    const categories = await PTCategory.findAll();
    return res.status(200).json({ success: true, message: "Catégorie supprimée", categories });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.getAll = async (req, res) => {
  try {
    const categories = await PTCategory.findAll();
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.getCategoriesForEnter = async (req, res) => {
  try {
    const categories = await PTCategory.find({ type: "enter" });
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.getCategoriesForOutlet = async (req, res) => {
  try {
    const categories = await PTCategory.find({ type: "outlet" });
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}