const express = require("express");
const Transaction = require("../controllers/transactions.controller");
const router = express.Router();


router.get("/api/v1/transactions", Transaction.getAllTransactions);



module.exports = router;
