// Worker implementation for Next.js
// This file is used by Next.js build process

/**
 * Interface for worker functionality
 */
export interface WorkerInterface {
  on: (event: string, callback: Function) => WorkerInterface;
  postMessage: (message: any) => WorkerInterface;
  terminate: () => WorkerInterface;
}

/**
 * Creates a worker interface with no-op implementations
 * @returns {WorkerInterface} Worker interface
 */
export function worker(): WorkerInterface {
  return {
    // No-op implementation
    on: function(event: string, callback: Function): WorkerInterface {
      // Intentionally empty
      return this;
    },
    postMessage: function(message: any): WorkerInterface {
      // Intentionally empty
      return this;
    },
    terminate: function(): WorkerInterface {
      // Intentionally empty
      return this;
    }
  };
}

// Default export for compatibility
export default worker;
