class DisableWorkerThreadsPlugin {
  constructor() {
    this.name = 'DisableWorkerThreadsPlugin';
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(this.name, (compilation) => {
      // Manually set the HarmonyModulesPlugin to use a single process
      if (compilation.compiler.options && compilation.compiler.options.module) {
        compilation.compiler.options.module.unsafeCache = false;
      }
    });

    // Intercept any attempt to require worker_threads
    compiler.hooks.normalModuleFactory.tap(this.name, (nmf) => {
      nmf.hooks.beforeResolve.tap(this.name, (resolveData) => {
        if (resolveData.request === 'worker_threads') {
          resolveData.request = './lib/worker-threads-mock.js';
        }
      });
    });
  }
}

module.exports = DisableWorkerThreadsPlugin; 