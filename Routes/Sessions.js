const express = require("express")
const router = express.Router();
const sessionCtrl = require("../Controllers/Sessions");

const authUser = require("../Middlewares/Auth/authUser");
const authManager = require("../Middlewares/Auth/authManager");
const authAdmin = require("../Middlewares/Auth/authAdmin");
const validatorSessions = require("../Middlewares/Validators/validatorSessions");
const validatorItems = require("../Middlewares/Validators/validatorItems");
const existSession = require("../Middlewares/Exists/existSession");
const existItem = require("../Middlewares/Exists/existItem");
const isNotDone = require("../Middlewares/Exists/isNotDone");
const isDone = require("../Middlewares/Exists/isDone");
const Generator = require("../Controllers/Generator");

router.post("/", authUser, validatorSessions, sessionCtrl.startNewSession);

router.put("/:id/add-item", authUser, existSession, validatorItems, isNotDone, sessionCtrl.addItem);
router.put("/:id/remove-item/:idItem", authUser, existSession, existItem, isNotDone, sessionCtrl.removeItem);
router.put("/:id/increase/:idItem", authUser, existSession, existItem, isNotDone, sessionCtrl.increaseQuantity);
router.put("/:id/decrease/:idItem", authUser, existSession, existItem, isNotDone, sessionCtrl.decreaseQuantity);
router.put("/:id/add-reduction", authUser, existSession, isNotDone, sessionCtrl.addReduction);
router.put("/:id/remove-reduction", authUser, existSession, isNotDone, sessionCtrl.removeReduction);
router.put("/:id/end", authUser, existSession, isNotDone, sessionCtrl.endSession, Generator);
router.put("/:id/pay", authUser, existSession, isDone, sessionCtrl.paySession);
router.put("/:id/debt", authUser, existSession, isDone, sessionCtrl.debtSession);

router.put('/:id/printDrinksVoucher', existSession, isNotDone, sessionCtrl.generateVoucherForDrinks); 
router.put('/:id/printFoodsVoucher', existSession, isNotDone, sessionCtrl.generateVoucherForFoods);

router.put("/:id/remove-is-paid", authAdmin, existSession, isDone, sessionCtrl.removePayment);
router.put("/:id/remove-is-done", authAdmin, existSession, isDone, sessionCtrl.removeIsDone);

router.get("/not-done", authUser, sessionCtrl.getNotDoneSessions);
router.get("/voucher-print", authUser, sessionCtrl.getVouchersPrintWork);
router.get("/not-done-server", authUser, sessionCtrl.getNotDoneSessionsFromUser);
router.get("/one/:id", authUser, existSession, sessionCtrl.getOneSession);
router.get("/report-day/:timestamp", authUser, sessionCtrl.getReportOfADay);
router.get("/report-period/:begin/:end", authUser, sessionCtrl.getReportOfAPeriod);

module.exports = router;