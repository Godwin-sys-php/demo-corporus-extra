const express = require("express")
const router = express.Router();
const pCategoryCtrl = require("../Controllers/ProductsCategory");

const authUser = require("../Middlewares/Auth/authUser");
const existPCategory = require("../Middlewares/Exists/existPCategory");
const authAdmin = require("../Middlewares/Auth/authAdmin");

router.post("/create", authAdmin, pCategoryCtrl.createOneCategory);

router.put("/update/:id", authAdmin, existPCategory, pCategoryCtrl.updateOneCategory);

router.get("/get", authUser, pCategoryCtrl.getAllCategory);
router.get("/get/:id", authUser, existPCategory, pCategoryCtrl.getOneCategory);

router.delete("/delete/:id", authAdmin, existPCategory, pCategoryCtrl.deleteOneCategory);

module.exports = router;