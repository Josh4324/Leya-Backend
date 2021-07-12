const express = require("express");
const User = require("../controllers/user.controller");
const router = express.Router();


router.post("/api/v1/user/resetpassword", User.resetPassword);
router.post("/api/v1/user/forgot", User.forgotPassword);
router.post("/api/v1/user/reset", User.forgotPassword);



module.exports = router;
