/**
 * Mock implementation of worker_threads module
 * This provides empty implementations of all worker_threads functions
 * to prevent errors when the module is imported
 */

const noop = () => {};
const noopReturnsThis = function() { return this; };

module.exports = {
  Worker: class MockWorker {
    constructor() {
      this.postMessage = noopReturnsThis;
      this.terminate = noopReturnsThis;
      this.on = noopReturnsThis;
      this.off = noopReturnsThis;
      this.once = noopReturnsThis;
      this.removeListener = noopReturnsThis;
      this.removeAllListeners = noopReturnsThis;
      this.threadId = 0;
      this.resourceLimits = {};
      this.stderr = null;
      this.stdin = null;
      this.stdout = null;
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
