const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  userId: String,
  projectId: String,

  typingSpeed: Number,
  typedChars: Number,
  backspaceCount: Number,
  pasteCount: Number,
  pasteCharacters: Number,
  saveCount: Number,
  fileSwitchCount: Number,
  cursorMoveCount: Number,
  avgPauseTime: Number,
  sessionTime: Number,

  cognitiveStyle: { type: String, default: null },
  confidence: { type: Number, default: null },
  visualization: { type: String, default: null }, // Base64 image
  predictionTimestamp: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Session", SessionSchema);
