// Worker shim for Next.js
// This file provides a compatibility layer for worker threads

/**
 * Creates a worker interface with no-op implementations
 * @returns {Object} Worker interface
 */
function createWorker() {
  return {
    // No-op implementation
    on: function(event, callback) {
      // Silent no-op to prevent console spam
      return this;
    },
    postMessage: function(message) {
      // Silent no-op to prevent console spam
      return this;
    },
    terminate: function() {
      // Silent no-op to prevent console spam
      return this;
    },
    // Add additional worker properties that might be accessed
    threadId: 0,
    resourceLimits: {},
    stderr: null,
    stdin: null,
    stdout: null
  };
}

// Create a mock Worker class for compatibility
class MockWorker {
  constructor() {
    return createWorker();
  }
}

// Export both named and default exports to ensure compatibility
module.exports = createWorker;
module.exports.Worker = MockWorker;
module.exports.worker = createWorker;
module.exports.default = createWorker;
