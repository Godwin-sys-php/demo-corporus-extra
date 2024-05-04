const express = require("express")
const router = express.Router();
const userCtrl = require("../Controllers/Users");
const authAdmin = require("../Middlewares/Auth/authAdmin");
const validatorUsers = require("../Middlewares/Validators/validatorUsers");
const authUser = require("../Middlewares/Auth/authUser");

router.post("/login", userCtrl.login);

router.post("/create", validatorUsers, authAdmin, userCtrl.createUser);

router.put("/update/:id", authAdmin, userCtrl.updateOneUser);

router.get("/get", authAdmin, userCtrl.getAllUsers);
router.get("/get/:id", authUser, userCtrl.getOneUser);

router.delete("/delete/:id", authAdmin, userCtrl.deleteOneUser);  

module.exports = router;