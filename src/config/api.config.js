require('dotenv').config();

/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */
class ApiConfig {
  constructor() {
    this.customerApiUrl = process.env.CUSTOMER_API_URL || 'http://localhost:8000';
    this.productApiUrl = process.env.PRODUCT_API_URL || 'http://localhost:9000';
    this.timeout = process.env.API_TIMEOUT || 5000;
  }

  getCustomerCreateEndpoint() {
    return '/api/testing/customer/create';
  }

  getProductPurchaseEndpoint() {
    return '/api/test/product-purchase';
  }

  getCustomerApiUrl() {
    return this.customerApiUrl;
  }

  getProductApiUrl() {
    return this.productApiUrl;
  }

  getFullUrl(endpoint) {
    return `${this.customerApiUrl}${endpoint}`;
  }
}

module.exports = new ApiConfig();
