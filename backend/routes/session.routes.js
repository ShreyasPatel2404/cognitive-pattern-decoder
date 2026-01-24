const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const { sessionLimiter } = require("../middleware/rateLimiter");
const sessionController = require("../controllers/session.controller");

// 📊 CREATE SESSION (PROTECTED + RATE LIMITED)
router.post(
  "/",
  authMiddleware,
  sessionLimiter,
  sessionController.createSession
);

// 📄 GET SESSIONS BY USER
router.get("/user/:userId", authMiddleware, sessionController.getSessionsByUser);

// 📄 GET SESSIONS BY PROJECT
router.get(
  "/project/:projectId",
  authMiddleware,
  sessionController.getSessionsByProject
);

module.exports = router;
