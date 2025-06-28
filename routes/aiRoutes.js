const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middlewares/auth');

// Public endpoint for health assistant (no authentication required)
router.post('/health-assistant', aiController.healthAssistant);

// Protected routes - require authentication
router.use(protect);

// Get personalized insights for a specific patient
router.get('/insights/:patientId', aiController.getPersonalizedInsights);

// Get medication information
router.get('/medication-info', aiController.getMedicationInfo);

module.exports = router;