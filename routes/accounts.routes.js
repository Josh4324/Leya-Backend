const express = require("express");
const router = express.Router();
const Account = require("../controllers/accounts.controller");

router.get("/api/v1/accounts", Account.getAllAccounts);



module.exports = router;
