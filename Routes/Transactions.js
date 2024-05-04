const express = require("express")
const router = express.Router();
const transactionCtrl = require("../Controllers/Transactions");

const authManager = require("../Middlewares/Auth/authManager");
const validatorTransactions = require("../Middlewares/Validators/validatorTransactions");

router.post("/enter", authManager, validatorTransactions, transactionCtrl.createEnter);
router.post("/outlet", authManager, validatorTransactions, transactionCtrl.createOutlet);

router.get("/period/:start/:end", authManager, transactionCtrl.getTransactionsOnPeriod);
router.get("/prerequisities", authManager, transactionCtrl.getPrerequisities);

module.exports = router;