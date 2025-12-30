const customerService = require('./services/customer.service');
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
      logger.info('='.repeat(50));
      logger.info('CUSTOMER CREATION SCRIPT');
      logger.info('='.repeat(50));
      logger.info(`Configuration: ${this.config.numberOfUsers} users\n`);

      const results = await customerService.createMultipleCustomers(
        
        parseInt(this.config.numberOfUsers)
      );

      // Exit with appropriate code
      process.exit(results.failed > 0 ? 1 : 0);
    } catch (error) {
      logger.error('Fatal error:', error.message);
      process.exit(1);
    }
  }
}

// Bootstrap application
const app = new Application();
app.run();
