const express = require("express")
const router = express.Router();
const mCategoryCtrl = require("../Controllers/MCategory");

const authUser = require("../Middlewares/Auth/authUser");
const existMCategory = require("../Middlewares/Exists/existMCategory");
const authAdmin = require("../Middlewares/Auth/authAdmin");

router.post("/create", authAdmin, mCategoryCtrl.createOneMCategory);

router.put("/update/:id", authAdmin, existMCategory, mCategoryCtrl.updateOneMCategory);

router.get("/get", authUser, mCategoryCtrl.getAll);
router.get("/get/enter", authUser, mCategoryCtrl.getCategoriesForEnter);
router.get("/get/outlet", authUser, mCategoryCtrl.getCategoriesForOutlet);

router.delete("/delete/:id", authAdmin, existMCategory, mCategoryCtrl.deleteOneMCategory);

module.exports = router;