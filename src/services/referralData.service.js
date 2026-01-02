const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger.util');

/**
 * Referral Data Service
 * Single Responsibility: Handle referral data operations
 */
class ReferralDataService {
  constructor() {
    this.referralData = null;
  }

  /**
   * Load referral data from JSON file
   * @returns {object} Referral data mapping
   */
  loadReferralData() {
    if (this.referralData) {
      return this.referralData;
    }

    try {
      const filePath = path.join(__dirname, '../../referral-data1000.json');
      // const filePath = path.join(__dirname, '../../referral-data100.json');
      // const filePath = path.join(__dirname, '../../referral-data50.json');
      // const filePath = path.join(__dirname, '../../referral-data20.json');
      // const filePath = path.join(__dirname, '../../referral-data10000.json');
      // const filePath = path.join(__dirname, '../../referral-data100000.json');
      // const filePath = path.join(__dirname, '../../referral-data5000.json');
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      this.referralData = JSON.parse(fileContent);
      logger.info('✓ Referral data loaded successfully');
      return this.referralData;
    } catch (error) {
      logger.warn('⚠ Warning: Could not load referral-data.json file');
      this.referralData = {};
      return this.referralData;
    }
  }

  /**
   * Get assigned value for a customer index
   * @param {number} customerIndex - Customer index
   * @returns {number|null} Assigned value or null
   */
  getAssignValue(customerIndex) {
    if (!this.referralData) {
      this.loadReferralData();
    }

    const key = customerIndex.toString();
    if (this.referralData.hasOwnProperty(key)) {
      return this.referralData[key];
    }
    return null;
  }

  /**
   * Check if customer has assigned value
   * @param {number} customerIndex - Customer index
   * @returns {boolean} True if has non-null assigned value
   */
  hasAssignedValue(customerIndex) {
    const value = this.getAssignValue(customerIndex);
    return value !== null;
  }

  /**
   * Get statistics about referral data
   * @returns {object} Statistics
   */
  getStatistics() {
    if (!this.referralData) {
      this.loadReferralData();
    }

    const total = Object.keys(this.referralData).length;
    const assigned = Object.values(this.referralData).filter(v => v !== null).length;
    const unassigned = total - assigned;

    return {
      total,
      assigned,
      unassigned,
      assignmentRate: total > 0 ? (assigned / total * 100).toFixed(2) : 0
    };
  }
}

module.exports = new ReferralDataService();
