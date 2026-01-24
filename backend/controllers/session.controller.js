const Session = require("../models/Session.model");

// ===============================
// CREATE SESSION WITH VALIDATION
// ===============================
exports.createSession = async (req, res) => {
  try {
    const {
      projectId,
      typingSpeed,
      typedChars,
      backspaceCount,
      pasteCount,
      pasteCharacters,
      saveCount,
      fileSwitchCount,
      cursorMoveCount,
      avgPauseTime,
      sessionTime
    } = req.body;

    // ===============================
    // DATA INTEGRITY VALIDATION
    // ===============================

    if (typingSpeed < 0) {
      return res.status(400).json({ error: "Invalid typingSpeed" });
    }

    if (typedChars < 0) {
      return res.status(400).json({ error: "Invalid typedChars" });
    }

    if (backspaceCount < 0) {
      return res.status(400).json({ error: "Invalid backspaceCount" });
    }

    if (pasteCount < 0) {
      return res.status(400).json({ error: "Invalid pasteCount" });
    }

    if (avgPauseTime < 0) {
      return res.status(400).json({ error: "Invalid avgPauseTime" });
    }

    if (sessionTime <= 0) {
      return res.status(400).json({ error: "Invalid sessionTime" });
    }

    // ===============================
    // SAVE SESSION (CLEAN DATA)
    // ===============================
    const session = new Session({
      userId: req.user.userId, // 🔐 From JWT
      projectId,
      typingSpeed,
      typedChars,
      backspaceCount,
      pasteCount,
      pasteCharacters,
      saveCount,
      fileSwitchCount,
      cursorMoveCount,
      avgPauseTime,
      sessionTime
    });

    await session.save();

    res.status(201).json({ message: "Session saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save session" });
  }
};

// ===============================
// GET SESSIONS BY USER
// ===============================
exports.getSessionsByUser = async (req, res) => {
  const sessions = await Session.find({ userId: req.params.userId });
  res.json(sessions);
};

// ===============================
// GET SESSIONS BY PROJECT
// ===============================
exports.getSessionsByProject = async (req, res) => {
  const sessions = await Session.find({ projectId: req.params.projectId });
  res.json(sessions);
};
