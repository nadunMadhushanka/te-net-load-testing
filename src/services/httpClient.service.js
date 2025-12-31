const axios = require('axios');
const apiConfig = require('../config/api.config');

/**
 * HTTP Client Service
 * Single Responsibility: Handle all HTTP communication
 */
class HttpClientService {
  constructor() {
    this.customerClient = axios.create({
      baseURL: apiConfig.getCustomerApiUrl(),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.productClient = axios.create({
      baseURL: apiConfig.getProductApiUrl(),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Send POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @param {string} apiType - 'customer' or 'product' (default: 'customer')
   * @returns {Promise<object>} Response data
   */
  async post(endpoint, data, apiType = 'customer') {

    try {
      const client = apiType === 'product' ? this.productClient : this.customerClient;
      const baseURL = apiType === 'product' ? apiConfig.getProductApiUrl() : apiConfig.getCustomerApiUrl();
      const fullURL = `${baseURL}${endpoint}`;
      
      console.log('🌐 POST Request URL:', fullURL);
      console.log('📦 Request Data:', data);
      console.log('🔧 API Type:', apiType);
      
      const response = await client.post(endpoint, data);
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
      const response = await this.customerClient.get(endpoint);
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
