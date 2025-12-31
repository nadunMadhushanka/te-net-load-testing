require('dotenv').config();

/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */
class ApiConfig {
  constructor() {
    this.baseUrl = process.env.API_URL || 'http://localhost:8000';
    this.timeout = process.env.API_TIMEOUT || 5000;
  }

  getCustomerCreateEndpoint() {
    return '/api/testing/customer/create';
  }

  getFullUrl(endpoint) {
    return `${this.baseUrl}${endpoint}`;
  }
}

module.exports = new ApiConfig();
