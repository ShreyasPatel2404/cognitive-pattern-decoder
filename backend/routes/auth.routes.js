const express = require("express");
const router = express.Router();

const { loginLimiter } = require("../middleware/rateLimiter");
const authController = require("../controllers/auth.controller");

// 🔐 LOGIN WITH RATE LIMITING
router.post("/login", loginLimiter, authController.login);

// 🔐 REGISTER (optional – no limiter or same one)
router.post("/register", authController.register);
router.get("/register",(req,res)=>{console.log("hello world");res.send("hello world")});

module.exports = router;
