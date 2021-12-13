const express = require("express");
const router = express.Router();
const Merchant = require("../controllers/merchants.controller");

router.get("/api/v1/merchants", Merchant.getAllMerchants);
router.post("/api/v1/add-merchant", Merchant.AddMerchant);

module.exports = router;
