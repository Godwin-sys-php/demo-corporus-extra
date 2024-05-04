const express = require("express")
const router = express.Router();
const clientCtrl = require("../Controllers/Clients");

const authUser = require("../Middlewares/Auth/authUser");
const existClient = require("../Middlewares/Exists/existClient");
const authManager = require("../Middlewares/Auth/authManager");

router.post("/create", authUser, clientCtrl.createOneClient);
router.post("/:id/pay-debt", authManager, existClient, clientCtrl.payDebt);
router.post("/:id/add-debt", authManager, existClient, clientCtrl.addDebt);

router.put("/update/:id", authUser, existClient, clientCtrl.updateOneClient);

router.get("/get", authUser, clientCtrl.getAllClients);
router.get("/get/:id", authUser, existClient, clientCtrl.getOneClient);

router.delete("/delete/:id", authUser, existClient, clientCtrl.deleteOneClient);

module.exports = router;