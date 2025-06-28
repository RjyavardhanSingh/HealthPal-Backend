const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getRelevantDocuments } = require('../services/retrievalService');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health Assistant endpoint
exports.healthAssistant = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }
    
    // Generate content with Gemini Pro
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Build the prompt - simplified without retrieval
    const prompt = `You are HealthPal, a medical assistant AI. Answer the following health question:
    
    ${query}
    
    Provide a clear, accurate response. Include a disclaimer about consulting healthcare professionals.`;
    
    // Generate response
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    res.status(200).json({
      success: true,
      answer: text
    });
  } catch (error) {
    console.error('Health assistant error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing health assistant request'
    });
  }
};

// Placeholder for future methods
exports.getPersonalizedInsights = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Personalized insights feature coming soon"
  });
};

exports.getMedicationInfo = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Medication information feature coming soon"
  });
};