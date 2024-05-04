const express = require("express")
const router = express.Router();
const mTransactionCtrl = require("../Controllers/MTransactions");

const authManager = require("../Middlewares/Auth/authManager");
const validatorMTransactions = require("../Middlewares/Validators/validatorMTransactions");

router.post("/enter", authManager, validatorMTransactions, mTransactionCtrl.createEnter);
router.post("/outlet", authManager, validatorMTransactions, mTransactionCtrl.createOutlet);

router.get("/period/:start/:end", authManager, mTransactionCtrl.getTransactionsOnPeriod);
router.get("/prerequisities", authManager, mTransactionCtrl.getPrerequisities);

module.exports = router;