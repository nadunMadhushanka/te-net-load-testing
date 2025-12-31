const httpClient = require('./httpClient.service');
const apiConfig = require('../config/api.config');
const Customer = require('../models/customer.model');
const productService = require('./product.service');
const referralDataService = require('./referralData.service');
const logger = require('../utils/logger.util');

/**
 * Customer Service
 * Single Responsibility: Handle customer-related operations only
 */
class CustomerService {
  constructor() {
    // Hardcoded product purchases: [customerId, productId, customerId, productId, ...]
    this.productPurchases = [
      1
    ];
  }

  /**
   * Get random product ID from the list
   * @returns {number} Random product ID
   */
  getRandomProductId() {
    const productIds = [];
    for (let i = 0; i < this.productPurchases.length; i += 1) {
      productIds.push(this.productPurchases[i]);
    }
    
    // Return random product ID
    const randomIndex = Math.floor(Math.random() * productIds.length);
    return productIds[randomIndex];
  }


  /**
   * Create a single customer
   * @param {Customer} customer - Customer object
   * @returns {Promise<object>} Response from API
   */
  async createCustomer(customer) {
    const endpoint = apiConfig.getCustomerCreateEndpoint();
    logger.info(`👤 Creating customer: ${customer.email}`);
    logger.debug('Request data:', customer.toJSON());

    const response = await httpClient.post(endpoint, customer.toJSON());

    if (response.success) {
      logger.success(`✓ Customer created successfully: ${customer.email}`);
      logger.debug('Response:', response.data);
    } else {
      logger.error(`✗ Failed to create customer: ${customer.email}`);
      logger.error('Error:', response.error);
    }

    return response;
  }

  /**
   * Process customer creation with product purchase workflow
   * @param {number} customerIndex - Customer index
   * @returns {Promise<object>} Workflow result
   */
  async processCustomer(customerIndex) {
    const customer = Customer.generateTestCustomer(customerIndex);
    
    logger.info(`Referral ID: ${customer.referral_id}`);

    const result = {
      customerCreated: false,
      productPurchased: false,
      customerResponse: null,
      productResponse: null
    };

    // Create customer
    const customerResponse = await this.createCustomer(customer);
    result.customerResponse = customerResponse;

    if (!customerResponse.success) {
      return result;
    }

    result.customerCreated = true;

    // Check if customer has a value in referral data
    const hasReferralValue = referralDataService.hasAssignedValue(customerIndex);

    if (hasReferralValue) {
      logger.info(`📌 Index ${customerIndex} has referral value`);
      
      // Get random product ID from hardcoded list
      const productId = this.getRandomProductId();
      logger.info(`🎲 Selected random product ID: ${productId}`);
      
      const productResponse = await productService.createProductPurchase(
        customerIndex,
        productId
      );
      
      result.productResponse = productResponse;
      result.productPurchased = productResponse.success;
    } else {
      logger.info(`⏭️  Skipping product purchase - No referral value for index ${customerIndex}`);
    }

    return result;
  }
}

module.exports = new CustomerService();
