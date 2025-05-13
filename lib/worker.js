// Worker implementation for Next.js
// This file is used by Next.js build process

/**
 * Creates a mock worker thread implementation
 * This is a stub to prevent errors when Next.js tries to use worker threads
 */
class MockWorker {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return this;
  }

  postMessage(message) {
    // No-op implementation
    return this;
  }

  terminate() {
    this.events = {};
    return this;
  }
}

// Export as both named and default exports for maximum compatibility
const worker = () => new MockWorker();

module.exports = worker;
module.exports.worker = worker;
module.exports.default = worker;
