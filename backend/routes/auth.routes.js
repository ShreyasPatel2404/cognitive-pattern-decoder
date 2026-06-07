const express = require("express");
const router = express.Router();

const { loginLimiter } = require("../middleware/rateLimiter");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const User = require("../models/User.model");
// 🔐 LOGIN WITH RATE LIMITING
router.post("/login", loginLimiter, authController.login);

// 🔐 REGISTER (optional – no limiter or same one)
router.post("/register", authController.register);
router.get("/register",(req,res)=>{console.log("hello world");res.send("hello world")});

// GET /api/auth/profile  (protected route)
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;