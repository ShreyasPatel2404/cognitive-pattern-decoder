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

    const session = new Session({
      userId: req.user.userId, // 🔐 Strictly from JWT
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

    res.status(201).json({ message: "Session saved successfully", session });
  } catch (error) {
    console.error("Create Session Error:", error);
    res.status(500).json({ error: "Failed to save session" });
  }
};

// ===============================
// GET SESSIONS BY USER (CURRENT)
// ===============================
exports.getSessionsByUser = async (req, res) => {
  try {
    // Strictly use the ID from the token, ignore params if they attempt to spoof
    const userId = req.user.userId;
    const sessions = await Session.find({ userId }).sort({ createdAt: 1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// ===============================
// GET SESSIONS BY PROJECT
// ===============================
exports.getSessionsByProject = async (req, res) => {
  try {
    // Only fetch if session belongs to user (if filtering by project)
    // For now simplistic implementation:
    const sessions = await Session.find({
      projectId: req.params.projectId,
      userId: req.user.userId
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project sessions" });
  }
};
