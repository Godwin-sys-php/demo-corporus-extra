const express = require("express")
const router = express.Router();
const ptCategoryCtrl = require("../Controllers/PTCategory");

const authUser = require("../Middlewares/Auth/authUser");
const existPTCategory = require("../Middlewares/Exists/existPTCategory");
const authAdmin = require("../Middlewares/Auth/authAdmin");

router.post("/create", authAdmin, ptCategoryCtrl.createOnePTCategory);

router.put("/update/:id", authAdmin, existPTCategory, ptCategoryCtrl.updateOnePTCategory);

router.get("/get", authUser, ptCategoryCtrl.getAll);
router.get("/get/enter", authUser, ptCategoryCtrl.getCategoriesForEnter);
router.get("/get/outlet", authUser, ptCategoryCtrl.getCategoriesForOutlet);

router.delete("/delete/:id", authAdmin, existPTCategory, ptCategoryCtrl.deleteOnePTCategory);

module.exports = router;