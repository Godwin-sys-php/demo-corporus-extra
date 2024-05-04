const express = require("express")
const router = express.Router();
const maccountCtrl = require("../Controllers/MAccount");

const authUser = require("../Middlewares/Auth/authUser");
const existAccount = require("../Middlewares/Exists/existAccount");
const authAdmin = require("../Middlewares/Auth/authAdmin");

router.post("/create", authAdmin, maccountCtrl.createOneAccount);

router.put("/update/:id", authAdmin, existAccount, maccountCtrl.updateOneAccount);

router.get("/get", authUser, maccountCtrl.getAllAccount);
router.get("/get/:id", authUser, existAccount, maccountCtrl.getOneAccount);

router.delete("/delete/:id", authAdmin, existAccount, maccountCtrl.deleteOneAccount);

module.exports = router;