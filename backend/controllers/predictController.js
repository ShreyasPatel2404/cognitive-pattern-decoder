const Session = require('../models/Session.model');
const mlService = require('../services/mlService');

/**
 * Predict cognitive style based on session metrics
 * @route POST /api/predict
 */
exports.predictCognitiveStyle = async (req, res) => {
    try {
        const sessionData = req.body;

        // 1. Get Prediction from ML Service
        console.log('Sending data to ML Service:', sessionData.typingSpeed, 'WPM');
        const mlResponse = await mlService.predict(sessionData);

        // 2. Prepare result
        const { cognitive_style, confidence, visualization } = mlResponse;

        // 3. Save to Database if User is authenticated 
        // (If not authenticated, we might still want to return the result without saving, 
        // or save it as an anonymous session if needed. For now, we'll try to find a session or create one)

        let savedSession = null;

        // Helper to add prediction to a session object
        const updateData = {
            cognitiveStyle: cognitive_style,
            confidence: confidence,
            visualization: visualization,
            predictionTimestamp: new Date()
        };

        // If we have a user, we try to save/update. 
        // Note: The prompt says "Store prediction and confidence inside session document".
        // Usually, the session is created first, then analyzed. Or created *upon* analysis.
        // If we assume a new session is created for this analysis:

        const newSession = new Session({
            ...sessionData,
            userId: req.user ? req.user.id : (sessionData.userId || 'anonymous'), // Use auth user if available
            ...updateData
        });

        savedSession = await newSession.save();
        console.log('Prediction saved for session:', savedSession._id);

        // 4. Return result
        res.json({
            success: true,
            cognitive_style,
            confidence,
            visualization, // Base64 string
            sessionId: savedSession._id
        });

    } catch (error) {
        console.error('Prediction Controller Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'Prediction failed'
        });
    }
};
