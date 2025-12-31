const httpClient = require('./httpClient.service');
const apiConfig = require('../config/api.config');
const ProductPurchase = require('../models/productPurchase.model');
const logger = require('../utils/logger.util');

/**
 * Product Service
 * Single Responsibility: Handle product purchase operations
 */
class ProductService {
  /**
   * Create a product purchase
   * @param {number} customerId - Customer ID
   * @param {number} productId - Product ID
   * @returns {Promise<object>} Response from API
   */
  async createProductPurchase(customerId, productId) {
    const endpoint = apiConfig.getProductPurchaseEndpoint();
    const purchase = new ProductPurchase(customerId, productId);

    logger.info(`🛒 Creating product purchase - Customer: ${customerId}, Product: ${productId}`);
    logger.debug('Purchase data:', purchase.toJSON());

    const response = await httpClient.post(endpoint, purchase.toJSON(), 'product');

    if (response.success) {
      logger.success(`✓ Product purchase created successfully`);
      logger.debug('Response:', response.data);
    } else {
      logger.error(`✗ Failed to create product purchase`);
      logger.error('Error:', response.error);
    }

    return response;
  }

  /**
   * Create multiple product purchases
   * @param {Array<{customerId: number, productId: number}>} purchases - Array of purchase data
   * @returns {Promise<object>} Summary of results
   */
  async createMultiplePurchases(purchases) {
    const results = {
      total: purchases.length,
      successful: 0,
      failed: 0,
      errors: []
    };

    for (const purchase of purchases) {
      const response = await this.createProductPurchase(
        purchase.customerId,
        purchase.productId
      );

      if (response.success) {
        results.successful++;
      } else {
        results.failed++;
        results.errors.push({
          customerId: purchase.customerId,
          productId: purchase.productId,
          error: response.error
        });
      }
    }

    return results;
  }
}

module.exports = new ProductService();
