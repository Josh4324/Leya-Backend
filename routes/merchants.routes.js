const express = require("express");
const router = express.Router();
const Merchant = require("../controllers/merchants.controller");

router.get("/api/v1/merchants", Merchant.getAllMerchants);



module.exports = router;
