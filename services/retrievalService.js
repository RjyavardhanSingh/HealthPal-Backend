/**
 * Simple placeholder for retrieval service
 * This is a minimal implementation to prevent server crashes
 * Replace with actual vector database integration when ready
 */

/**
 * Get relevant documents for a query
 * Currently returns an empty array as we haven't implemented the vector DB
 * @param {string} query - The user's question
 * @returns {Promise<Array>} - Array of relevant document objects
 */
exports.getRelevantDocuments = async (query) => {
  console.log('retrievalService: Query received:', query);
  // Return empty array since we don't have a vector database yet
  return [];
};