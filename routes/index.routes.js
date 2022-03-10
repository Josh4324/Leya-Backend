const express = require("express");
const router = express.Router();
const Loan = require("./loan.routes");
const User = require("./user.routes");

router.use(Loan);
router.use(User);

router.get("/api", function (req, res, next) {
  res.status(200).json({ message: "LEYA API" });
});

module.exports = router;
