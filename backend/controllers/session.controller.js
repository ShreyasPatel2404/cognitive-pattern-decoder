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
    const sessions = await Session.find({ userId }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// ===============================
// GET SESSIONS WITH PAGINATION
// ===============================
exports.getSessionsByPage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const sessions = await Session.find({ userId })
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Session.countDocuments({ userId });
    res.json({
      sessions,
      total,
      pages: Math.ceil(total / limitNumber),
      currentPage: pageNumber
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch paginated sessions" });
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

// ===============================
// DELETE SESSION
// ===============================
exports.deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!session) {
      const err = new Error('Session not found');
      err.statusCode = 404;
      return next(err);
    }

    await Session.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Session deleted' });
  } catch (error) {
    next(error);
  }
};
