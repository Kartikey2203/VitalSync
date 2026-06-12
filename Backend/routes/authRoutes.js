const express = require("express");
const router = express.Router();
const { googleLogin } = require("../controller/authController");

router.post("/google", googleLogin);

module.exports = router;