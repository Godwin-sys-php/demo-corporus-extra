const PTCategory = require("../../Models/PTCategory");

module.exports = async (req, res, next) => {
  try {
    const category = await PTCategory.find({ id: req.params.id });
    console.log(category);
    if (category.length === 0) {
      return res.status(404).json({ cannott: true, message: "Catégorie inconnue" });
    }
    req._ptCategory = category[0];
    return next();
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}