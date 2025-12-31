const customerService = require('./customer.service');
const productService = require('./product.service');
const referralDataService = require('./referralData.service');
const logger = require('../utils/logger.util');

/**
 * Workflow Service
 * Single Responsibility: Orchestrate complex workflows
 * Coordinates customer creation and product purchase operations
 */
class WorkflowService {
  constructor() {
    // Load referral data on initialization
    referralDataService.loadReferralData();
  }

  /**
   * Create customer and handle product purchase if applicable
   * @param {Customer} customer - Customer object
   * @param {number} customerIndex - Customer index number
   * @returns {Promise<object>} Workflow result
   */
  async processCustomerCreation(customer, customerIndex) {
    const result = {
      customerCreated: false,
      productPurchased: false,
      customerResponse: null,
      productResponse: null
    };

    // Step 1: Create customer
    const customerResponse = await customerService.createCustomer(customer);
    result.customerResponse = customerResponse;

    if (!customerResponse.success) {
      result.customerCreated = false;
      return result;
    }

    result.customerCreated = true;

    // Step 2: Check if customer has product assignment
    const productId = referralDataService.getProductId(customerIndex);

    if (productId !== null) {
      logger.info(`📌 Index ${customerIndex} has assigned product: ${productId}`);
      
      // Step 3: Create product purchase
      const productResponse = await productService.createProductPurchase(
        customerIndex,
        productId
      );
      
      result.productResponse = productResponse;
      result.productPurchased = productResponse.success;
    }

    return result;
  }

  /**
   * Create multiple customers with product purchases
   * @param {number} count - Number of customers to create
   * @returns {Promise<object>} Summary of results
   */
  async bulkCustomerCreation(count) {
    logger.info(`Starting bulk customer creation: ${count} customers\n`);

    // Show referral data statistics
    const stats = referralDataService.getStatistics();
    logger.info('Referral Data Statistics:');
    logger.info(`  Total entries: ${stats.total}`);
    logger.info(`  Assigned products: ${stats.assigned}`);
    logger.info(`  Unassigned: ${stats.unassigned}`);
    logger.info(`  Assignment rate: ${stats.assignmentRate}%\n`);

    const results = {
      total: count,
      customersCreated: 0,
      customersFailed: 0,
      productsPurchased: 0,
      productsFailed: 0,
      errors: []
    };

    for (let i = 1; i <= count; i++) {
      logger.info(`\n${'='.repeat(60)}`);
      logger.info(`Processing Customer ${i}/${count}`);
      logger.info('='.repeat(60));

      const workflowResult = await customerService.processCustomer(i);

      // Update statistics
      if (workflowResult.customerCreated) {
        results.customersCreated++;
      } else {
        results.customersFailed++;
        results.errors.push({
          customerIndex: i,
          type: 'customer_creation',
          error: workflowResult.customerResponse?.error
        });
      }

      if (workflowResult.productPurchased) {
        results.productsPurchased++;
      } else if (workflowResult.productResponse) {
        // Product purchase was attempted but failed
        results.productsFailed++;
        results.errors.push({
          customerIndex: i,
          type: 'product_purchase',
          error: workflowResult.productResponse?.error
        });
      }
    }

    // Display summary
    this.displaySummary(results);

    return results;
  }

  /**
   * Display workflow summary
   * @param {object} results - Results summary
   */
  displaySummary(results) {
    logger.info(`\n${'='.repeat(60)}`);
    logger.info('WORKFLOW SUMMARY');
    logger.info('='.repeat(60));
    
    logger.info('\nCustomer Creation:');
    logger.info(`  Total: ${results.total}`);
    logger.success(`  Successful: ${results.customersCreated}`);
    if (results.customersFailed > 0) {
      logger.error(`  Failed: ${results.customersFailed}`);
    }

    logger.info('\nProduct Purchases:');
    logger.success(`  Successful: ${results.productsPurchased}`);
    if (results.productsFailed > 0) {
      logger.error(`  Failed: ${results.productsFailed}`);
    }

    if (results.errors.length > 0) {
      logger.info('\nErrors:');
      results.errors.forEach((error, index) => {
        logger.error(`  ${index + 1}. Customer ${error.customerIndex} - ${error.type}: ${JSON.stringify(error.error)}`);
      });
    }

    logger.info('\n' + '='.repeat(60) + '\n');
  }
}

module.exports = new WorkflowService();
