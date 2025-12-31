const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger.util');

/**
 * Data Logger Service
 * Single Responsibility: Save workflow data to JSON file for review
 */
class DataLoggerService {
  constructor() {
    this.logFilePath = path.join(__dirname, '../../workflow-results.json');
    this.sessionData = {
      sessionStart: new Date().toISOString(),
      sessionEnd: null,
      totalCustomers: 0,
      customers: [],
      summary: {}
    };
  }

  /**
   * Initialize new session
   * @param {number} totalCustomers - Total number of customers to create
   */
  initializeSession(totalCustomers) {
    this.sessionData = {
      sessionStart: new Date().toISOString(),
      sessionEnd: null,
      totalCustomers: totalCustomers,
      customers: [],
      summary: {
        customersCreated: 0,
        customersFailed: 0,
        productsPurchased: 0,
        productsFailed: 0
      }
    };
  }

  /**
   * Log customer workflow result
   * @param {number} customerIndex - Customer index
   * @param {object} customer - Customer object
   * @param {object} workflowResult - Workflow result
   */
  logCustomerWorkflow(customerIndex, customer, workflowResult) {
    const customerLog = {
      index: customerIndex,
      timestamp: new Date().toISOString(),
      customer: {
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        referral_id: customer.referral_id
      },
      creation: {
        success: workflowResult.customerCreated,
        status: workflowResult.customerResponse?.status,
        response: workflowResult.customerResponse?.data,
        error: workflowResult.customerResponse?.error
      }
    };

    // Add product purchase info if applicable
    if (workflowResult.productResponse) {
      customerLog.productPurchase = {
        attempted: true,
        success: workflowResult.productPurchased,
        productId: workflowResult.productResponse?.data?.product_id,
        status: workflowResult.productResponse?.status,
        response: workflowResult.productResponse?.data,
        error: workflowResult.productResponse?.error
      };
    } else {
      customerLog.productPurchase = {
        attempted: false,
        reason: 'No referral value assigned'
      };
    }

    this.sessionData.customers.push(customerLog);

    // Update summary
    if (workflowResult.customerCreated) {
      this.sessionData.summary.customersCreated++;
    } else {
      this.sessionData.summary.customersFailed++;
    }

    if (workflowResult.productPurchased) {
      this.sessionData.summary.productsPurchased++;
    } else if (workflowResult.productResponse) {
      this.sessionData.summary.productsFailed++;
    }

    // Save after each customer (real-time updates)
    this.saveToFile();
  }

  /**
   * Finalize session and save
   * @param {object} finalSummary - Final workflow summary
   */
  finalizeSession(finalSummary) {
    this.sessionData.sessionEnd = new Date().toISOString();
    this.sessionData.summary = {
      ...this.sessionData.summary,
      ...finalSummary
    };

    const duration = new Date(this.sessionData.sessionEnd) - new Date(this.sessionData.sessionStart);
    this.sessionData.durationMs = duration;
    this.sessionData.durationSeconds = (duration / 1000).toFixed(2);

    this.saveToFile();
    logger.info(`📝 Workflow data saved to: ${this.logFilePath}`);
  }

  /**
   * Save current data to JSON file
   */
  saveToFile() {
    try {
      const jsonData = JSON.stringify(this.sessionData, null, 2);
      fs.writeFileSync(this.logFilePath, jsonData, 'utf-8');
    } catch (error) {
      logger.error('Failed to save workflow data to file:', error.message);
    }
  }

  /**
   * Get current session data
   * @returns {object} Session data
   */
  getSessionData() {
    return this.sessionData;
  }

  /**
   * Read previous session from file
   * @returns {object|null} Previous session data or null
   */
  readPreviousSession() {
    try {
      if (fs.existsSync(this.logFilePath)) {
        const fileContent = fs.readFileSync(this.logFilePath, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (error) {
      logger.error('Failed to read previous session:', error.message);
    }
    return null;
  }
}

module.exports = new DataLoggerService();
