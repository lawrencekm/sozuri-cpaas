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
      console.log(`Worker event '${event}' registered but not implemented`);
      return this;
    },
    postMessage: function(message) {
      console.log('Worker postMessage called but not implemented', message);
      return this;
    },
    terminate: function() {
      console.log('Worker terminate called but not implemented');
      return this;
    }
  };
}

// Export both named and default exports to ensure compatibility
module.exports = {
  worker: createWorker,
  default: createWorker
};
