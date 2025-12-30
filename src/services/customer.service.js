const httpClient = require('./httpClient.service');
const apiConfig = require('../config/api.config');
const Customer = require('../models/customer.model');
const logger = require('../utils/logger.util');
const fs = require('fs');
const path = require('path');

/**
 * Customer Service
 * Single Responsibility: Handle customer-related business logic
 */
class CustomerService {
  constructor() {
    // Load referral data from JSON file
    this.referralData = this.loadReferralData();
  }

  /**
   * Load referral data from JSON file
   * @returns {object} Referral data mapping
   */
  loadReferralData() {
    try {
      const filePath = path.join(__dirname, '../../referral-data.json');
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      logger.warn('Warning: Could not load referral-data.json file');
      return {};
    }
  }

  /**
   * Check if index has null value in referral data
   * @param {number} index - Customer index
   */
  checkReferralData(index) {
    const key = index.toString();
    if (this.referralData.hasOwnProperty(key) && this.referralData[key] === null) {
      logger.info(`⚠️  Index ${index} has NULL value in referral data`);
    }
  }

  /**
   * Create a single customer
   * @param {Customer} customer - Customer object
   * @param {number} index - Customer index number
   * @returns {Promise<object>} Response from API
   */
  async createCustomer(customer, index) {
    const endpoint = apiConfig.getCustomerCreateEndpoint();
    logger.info(`Creating customer: ${customer.email}`);
    logger.debug('Request data:', customer.toJSON());

    const response = await httpClient.post(endpoint, customer.toJSON());

    if (response.success) {
      logger.success(`✓ Customer created successfully: ${customer.email}`);
      logger.debug('Response:', response.data);
      
      // Check referral data after successful creation
      this.checkReferralData(index);
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

      const response = await this.createCustomer(customer, i);

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
