const MCategory = require("../../Models/MCategory");

module.exports = async (req, res, next) => {
  try {
    const category = await MCategory.find({ id: req.params.id });
    console.log(category);
    if (category.length === 0) {
      return res.status(404).json({ cannott: true, message: "Catégorie inconnue" });
    }
    req._mCategory = category[0];
    return next();
  } catch (error) {
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}