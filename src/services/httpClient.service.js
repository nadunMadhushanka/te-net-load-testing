const axios = require('axios');
const apiConfig = require('../config/api.config');

/**
 * HTTP Client Service
 * Single Responsibility: Handle all HTTP communication
 */
class HttpClientService {
  constructor() {
    this.client = axios.create({
      baseURL: apiConfig.baseUrl,
      timeout: apiConfig.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Send POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @returns {Promise<object>} Response data
   */
  async post(endpoint, data) {
    try {
      const response = await this.client.post(endpoint, data);
      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Send GET request
   * @param {string} endpoint - API endpoint
   * @returns {Promise<object>} Response data
   */
  async get(endpoint) {
    try {
      const response = await this.client.get(endpoint);
      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status,
        error: error.response?.data || error.message
      };
    }
  }
}

module.exports = new HttpClientService();
