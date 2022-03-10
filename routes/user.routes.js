const express = require("express");
const User = require("../controllers/user.controller");
const { Token } = require("../helpers");
const router = express.Router();

const token = new Token();

router.post("/api/v1/user/login", User.login);
router.get("/api/v1/user", token.verifyToken, User.getUser);
router.post("/api/v1/user/resetpassword", User.resetPassword);
router.post("/api/v1/user/forgot", User.forgotPassword);
router.post("/api/v1/user/reset", User.reset);
router.post("/api/v1/user/merchant-reset", User.adminReset);

module.exports = router;
