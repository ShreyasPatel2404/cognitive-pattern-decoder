const express = require("express");
const router = express.Router();

const {
  getResultsByUser
} = require("../controllers/mlresult.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Get ML results by user
router.get("/user/:userId", authMiddleware, getResultsByUser);

module.exports = router;
