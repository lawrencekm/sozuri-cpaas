/**
 * Mock implementation of worker_threads module
 * This provides empty implementations of all worker_threads functions
 * to prevent errors when the module is imported
 */

const noop = () => {};

// Simplified path resolution for better compatibility
let workerPath;
try {
  workerPath = require('path').resolve(__dirname, '../.next/server/lib/worker.js');
} catch (e) {
  workerPath = './worker.js'; // Fallback
}

module.exports = {
  Worker: class MockWorker {
    constructor() {
      this.postMessage = noop;
      this.terminate = noop;
      this.on = noop;
      this.off = noop;
      this.once = noop;
      this.removeListener = noop;
      this.removeAllListeners = noop;
    }
  },
  isMainThread: true,
  parentPort: {
    postMessage: noop,
    on: noop,
    once: noop,
    off: noop,
    removeListener: noop,
    removeAllListeners: noop
  },
  workerData: {},
  threadId: 0,
  MessageChannel: class MessageChannel {
    constructor() {
      this.port1 = {
        postMessage: noop,
        on: noop,
        once: noop,
        off: noop
      };
      this.port2 = {
        postMessage: noop,
        on: noop,
        once: noop,
        off: noop
      };
    }
  },
  MessagePort: class MessagePort {
    constructor() {
      this.postMessage = noop;
      this.on = noop;
      this.once = noop;
      this.off = noop;
    }
  },
  BroadcastChannel: class BroadcastChannel {
    constructor() {
      this.postMessage = noop;
      this.on = noop;
      this.once = noop;
      this.off = noop;
      this.close = noop;
    }
  }
};
