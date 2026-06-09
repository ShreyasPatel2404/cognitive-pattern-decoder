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

// 📄 GET SESSIONS WITH PAGINATION
router.get("/", authMiddleware, sessionController.getSessionsByPage);

// 📄 GET SESSIONS BY USER (CURRENT LOGGED IN)
router.get("/user", authMiddleware, sessionController.getSessionsByUser);

// 📄 GET SESSIONS BY PROJECT
router.get(
  "/project/:projectId",
  authMiddleware,
  sessionController.getSessionsByProject
);

// 🗑️ DELETE SESSION
router.delete('/:id', authMiddleware, sessionController.deleteSession);

module.exports = router;
