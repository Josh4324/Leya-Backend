const express = require('express');
const router = express.Router();
const Merchant = require('./merchants.routes');
const Account = require('./accounts.routes');
const Transaction = require('./transactions.routes');
const User = require('./user.routes');

router.use(Merchant);
router.use(Account);
router.use(Transaction);
router.use(User);


router.get('/api', function (req, res, next) {
  res.status(200).json({ message: 'VPS API' });
});

module.exports = router;
