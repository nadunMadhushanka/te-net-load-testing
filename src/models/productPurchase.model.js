/**
 * Product Purchase Model
 * Single Responsibility: Define product purchase data structure
 */
class ProductPurchase {
  constructor(customerId, productId) {
    this.customer_id = customerId;
    this.product_id = productId;
  }

  /**
   * Convert to JSON
   * @returns {object} JSON representation
   */
  toJSON() {
    return {
      customer_id: this.customer_id,
      product_id: this.product_id
    };
  }

  /**
   * Validate product purchase data
   * @returns {object} Validation result
   */
  validate() {
    const errors = [];

    if (!this.customer_id || this.customer_id < 1) {
      errors.push('Valid customer ID is required');
    }

    if (!this.product_id || this.product_id < 1) {
      errors.push('Valid product ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = ProductPurchase;
