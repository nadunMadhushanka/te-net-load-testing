/**
 * Random Utility
 * Single Responsibility: Handle random number generation
 */
class RandomUtil {
  /**
   * Get random referral ID based on current user count
   * @param {number} currentUserNumber - Current user being created
   * @returns {number} Random referral ID
   */
  getRandomReferralId(currentUserNumber) {
    if (currentUserNumber === 1) {
      return 1; // First user refers themselves or set to 1
    }
    // Random number between 1 and currentUserNumber - 1
    return Math.floor(Math.random() * (currentUserNumber - 1)) + 1;
  }

  /**
   * Get random number in range
   * @param {number} min - Minimum value (inclusive)
   * @param {number} max - Maximum value (inclusive)
   * @returns {number} Random number
   */
  getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

module.exports = new RandomUtil();
