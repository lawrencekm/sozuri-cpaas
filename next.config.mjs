/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: [], // Disable ESLint during development
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Add our worker.js file as an external module
    if (isServer) {
      // Disable minimizers to prevent worker thread usage
      config.optimization.minimizer = [];

      // Add an alias for the worker module
      config.resolve.alias = {
        ...config.resolve.alias,
        'worker_threads': './lib/worker-threads-mock.js'
      };
    }

    return config;
  },
  // Disable worker threads completely
  experimental: {
    cpus: 1
  },
}

export default nextConfig
