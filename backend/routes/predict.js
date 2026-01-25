const express = require('express');
const router = express.Router();
const { predictCognitiveStyle } = require('../controllers/predictController');
const authMiddleware = require('../middleware/auth.middleware');

// POST /api/predict
// apply authMiddleware if available, or make it optional depending on requirements.
// The prompt says: "If JWT authentication exists: Protect /api/predict"
router.post('/', authMiddleware, predictCognitiveStyle);

module.exports = router;
