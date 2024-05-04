const express = require("express")
const router = express.Router();
const productsCtrl = require("../Controllers/Products");

const authUser = require("../Middlewares/Auth/authUser");
const existPCategory = require("../Middlewares/Exists/existPCategory");
const existProduct = require("../Middlewares/Exists/existProduct");
const authAdmin = require("../Middlewares/Auth/authAdmin");
const validatorProducts = require("../Middlewares/Validators/validatorProducts");
const validatorProductsUpdate = require("../Middlewares/Validators/validatorProductsUpdate");

router.post("/create", authAdmin, validatorProducts, productsCtrl.createOneProduct);

router.put("/update/:id", authAdmin, existProduct, validatorProductsUpdate, productsCtrl.updateOneProduct);

router.get("/get", authUser, productsCtrl.getAllProducts);
router.get("/get/sellable", authUser, productsCtrl.getSellableProducts);
router.get("/get/versatile", authUser, productsCtrl.getVersatile);
router.get("/get/not-versatile", authUser, productsCtrl.getNotVersatile);
router.get("/get/one/:id", authUser, existProduct, productsCtrl.getOneProduct);
router.get("/get/category/:id", authUser, existPCategory, productsCtrl.getAllProductsByCategory);

router.delete("/delete/:id", authAdmin, existProduct, productsCtrl.deleteOneProduct);

module.exports = router;