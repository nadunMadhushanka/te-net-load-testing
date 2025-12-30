/**
 * Logger Utility
 * Single Responsibility: Handle all console logging with formatting
 */
class Logger {
  /**
   * Log info message
   * @param {...any} args - Arguments to log
   */
  info(...args) {
    console.log(...args);
  }

  /**
   * Log success message
   * @param {...any} args - Arguments to log
   */
  success(...args) {
    console.log('✓', ...args);
  }

  /**
   * Log error message
   * @param {...any} args - Arguments to log
   */
  error(...args) {
    console.error('✗', ...args);
  }

  /**
   * Log debug message (only if DEBUG mode is enabled)
   * @param {...any} args - Arguments to log
   */
  debug(...args) {
    if (process.env.DEBUG === 'true') {
      console.log('[DEBUG]', ...args);
    }
  }

  /**
   * Log warning message
   * @param {...any} args - Arguments to log
   */
  warn(...args) {
    console.warn('⚠', ...args);
  }
}

module.exports = new Logger();
