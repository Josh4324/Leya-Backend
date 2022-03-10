const express = require("express");
const Loan = require("../controllers/loan");
const { Token } = require("../helpers");
const router = express.Router();

const token = new Token();

router.get("/api/v1/loans", Loan.getLoans);

module.exports = router;
