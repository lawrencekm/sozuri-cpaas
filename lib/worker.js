// Placeholder worker file to prevent Next.js build errors
// This file is referenced by Next.js build process but was missing

module.exports = {
  // Empty export to satisfy module requirements
  worker: function() {
    return {
      // No-op implementation
      on: function() {},
      postMessage: function() {},
      terminate: function() {}
    };
  }
};
