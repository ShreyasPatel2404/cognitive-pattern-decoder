const axios = require('axios');

class MLService {
    constructor() {
        this.mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:5001';
    }

    /**
     * Send session metrics to ML service for prediction
     * @param {Object} sessionData - The session metrics
     * @returns {Promise<Object>} - The prediction result { cognitive_style, confidence, visualization }
     */
    async predict(sessionData) {
        try {
            const response = await axios.post(`${this.mlUrl}/predict`, sessionData, {
                timeout: 5000 // 5 seconds timeout
            });
            return response.data;
        } catch (error) {
            console.error('ML Service Error:', error.message);
            if (error.code === 'ECONNABORTED') {
                throw new Error('ML Service timed out');
            }
            if (error.response) {
                throw new Error(`ML Service failed with status ${error.response.status}`);
            }
            throw new Error('ML Service unavailable');
        }
    }
}

module.exports = new MLService();
