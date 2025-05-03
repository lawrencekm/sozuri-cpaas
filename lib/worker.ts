// Placeholder worker file to prevent Next.js build errors
// This file is referenced by Next.js build process but was missing

interface WorkerInterface {
  on: (event: string, callback: Function) => void;
  postMessage: (message: any) => void;
  terminate: () => void;
}

export function worker(): WorkerInterface {
  return {
    // No-op implementation
    on: function() {},
    postMessage: function() {},
    terminate: function() {}
  };
}

export default worker;
