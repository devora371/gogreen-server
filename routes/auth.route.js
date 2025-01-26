const express = require("express");
const { login, validateToken } = require("../controllers/auth.controller");

const router = express.Router();

// Login route
router.post("/login", login);
router.post("/validate-token", validateToken);

module.exports = router;
