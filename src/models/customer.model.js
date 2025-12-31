const randomUtil = require('../utils/random.util');

/**
 * Customer Model
 * Single Responsibility: Define customer data structure and validation
 */
class Customer {
  constructor(firstName, lastName, email, referralId) {
    this.first_name = firstName;
    this.last_name = lastName;
    this.email = email;
    this.referral_id = referralId;
  }

  /**
   * Convert customer object to JSON
   * @returns {object} JSON representation
   */
  toJSON() {
    return {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      referral_id: this.referral_id
    };
  }

  /**
   * Generate a test customer with incremental data
   * @param {number} index - Customer index number
   * @returns {Customer} New customer instance
   */
  static generateTestCustomer(index) {
    const referralId = randomUtil.getRandomReferralId(index);
    
    return new Customer(
      `${index}`,
      `${index}`,
      `${index}@gmail.com`,
      referralId
    );
  }

  /**
   * Validate customer data
   * @returns {object} Validation result
   */
  validate() {
    const errors = [];

    if (!this.first_name || this.first_name.trim() === '') {
      errors.push('First name is required');
    }

    if (!this.last_name || this.last_name.trim() === '') {
      errors.push('Last name is required');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Valid email is required');
    }

    if (!this.referral_id || this.referral_id < 1) {
      errors.push('Valid referral ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if email format is valid
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = Customer;
