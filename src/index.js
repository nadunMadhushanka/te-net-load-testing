const workflowService = require('./services/workflow.service');
const logger = require('./utils/logger.util');

/**
 * Main Application Entry Point
 * Open/Closed Principle: Open for extension, closed for modification
 */
class Application {
  constructor() {
    this.config = {
      numberOfUsers: process.env.NUMBER_OF_USERS || 10
    };
  }

  /**
   * Run the application
   */
  async run() {
    try {
      logger.info('='.repeat(60));
      logger.info('CUSTOMER CREATION & PRODUCT PURCHASE WORKFLOW');
      logger.info('='.repeat(60));
      logger.info(`Configuration: ${this.config.numberOfUsers} users\n`);

      const results = await workflowService.bulkCustomerCreation(
        parseInt(this.config.numberOfUsers)
      );

      // Exit with appropriate code
      const hasErrors = results.customersFailed > 0 || results.productsFailed > 0;
      process.exit(hasErrors ? 1 : 0);
    } catch (error) {
      logger.error('Fatal error:', error.message);
      logger.error('Stack:', error.stack);
      process.exit(1);
    }
  }
}

// Bootstrap application
const app = new Application();
app.run();
