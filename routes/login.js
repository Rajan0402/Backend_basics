const express = require("express");
const router = express.Router();
const userAuth = require("../controllers/userAuth");

router.post("/", userAuth.handleLogin);

module.exports = router;
