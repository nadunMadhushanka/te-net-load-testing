const httpClient = require('./httpClient.service');
const apiConfig = require('../config/api.config');
const Customer = require('../models/customer.model');
const logger = require('../utils/logger.util');

/**
 * Customer Service
 * Single Responsibility: Handle customer-related business logic
 */
class CustomerService {
  /**
   * Create a single customer
   * @param {Customer} customer - Customer object
   * @returns {Promise<object>} Response from API
   */
  async createCustomer(customer) {
    const endpoint = apiConfig.getCustomerCreateEndpoint();
    logger.info(`Creating customer: ${customer.email}`);
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
   * Create multiple customers
   * @param {number} count - Number of customers to create
   * @returns {Promise<object>} Summary of results
   */
  async createMultipleCustomers(count) {
    logger.info(`Starting bulk customer creation: ${count} customers\n`);

    const results = {
      total: count,
      successful: 0,
      failed: 0,
      errors: []
    };

    for (let i = 1; i <= count; i++) {
      const customer = Customer.generateTestCustomer(i);

      logger.info(`\n--- Creating Customer ${i}/${count} (Referral: ${customer.referral_id}) ---`);

      const response = await this.createCustomer(customer);

      if (response.success) {
        results.successful++;
      } else {
        results.failed++;
        results.errors.push({
          customerIndex: i,
          email: customer.email,
          error: response.error
        });
      }
    }

    logger.info(`\n${'='.repeat(50)}`);
    logger.info('BULK CREATION SUMMARY');
    logger.info(`${'='.repeat(50)}`);
    logger.info(`Total: ${results.total}`);
    logger.success(`Successful: ${results.successful}`);
    if (results.failed > 0) {
      logger.error(`Failed: ${results.failed}`);
    }
    logger.info(`${'='.repeat(50)}\n`);

    return results;
  }
}

module.exports = new CustomerService();
