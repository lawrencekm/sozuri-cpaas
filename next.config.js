/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Enable optimizations
  experimental: {
    // Memory and build optimizations
    webpackMemoryOptimizations: true,
    webpackBuildWorker: false, // Disable build worker to avoid worker-related issues

    // Performance optimizations
    cpus: 1, // Limit to single process
    optimizeCss: true,

    // Package optimizations
    optimizePackageImports: [
      'recharts',
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs'
    ],

    // Server actions
    serverActions: {
      allowedOrigins: ['localhost:3000']
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: [], // Disable ESLint during development
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable image optimization for better performance
    unoptimized: false,
    // Configure image domains if needed
    domains: [],
    // Set reasonable image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Limit image cache size
    minimumCacheTTL: 60,
  },
  webpack: (config, { isServer }) => {
    // Simplified webpack configuration
    config.parallelism = 1;

    if (isServer) {
      // Provide a mock implementation for worker_threads
      config.resolve.alias = {
        ...config.resolve.alias,
        'worker_threads': path.resolve(__dirname, 'lib/worker-threads-mock.js'),
        // Add an alias for the worker.js file
        './lib/worker.js': path.resolve(__dirname, 'lib/worker.js'),
        '../lib/worker.js': path.resolve(__dirname, 'lib/worker.js'),
        '../../lib/worker.js': path.resolve(__dirname, 'lib/worker.js'),
      };

      // Add fallbacks for node modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        'worker_threads': false,
        os: false,
        child_process: false,
        stream: false,
        http: false,
        https: false,
        zlib: false
      };

      // Copy the worker.js file to the output directory
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('CopyWorkerPlugin', () => {
            const fs = require('fs');
            const path = require('path');

            // Ensure the directory exists
            const outputDir = path.resolve(__dirname, '.next/server/lib');
            if (!fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir, { recursive: true });
            }

            // Copy the worker.js file
            const workerSource = path.resolve(__dirname, 'lib/worker.js');
            const workerDest = path.resolve(outputDir, 'worker.js');

            try {
              fs.copyFileSync(workerSource, workerDest);
              console.log('Successfully copied worker.js to output directory');
            } catch (err) {
              console.error('Error copying worker.js:', err);
            }
          });
        }
      });
    }

    // Very simple code splitting configuration to avoid any potential errors
    config.optimization.splitChunks = {
      chunks: 'all',
      maxInitialRequests: 10,
      cacheGroups: {
        // React and related packages
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
          name: 'react',
          priority: 40,
        },
        // Recharts and D3 packages
        recharts: {
          test: /[\\/]node_modules[\\/](recharts|d3)[\\/]/,
          name: 'recharts',
          priority: 30,
        },
        // Radix UI components
        radix: {
          test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
          name: 'radix',
          priority: 20,
        },
        // All other vendor packages
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
      },
    };

    return config;
  },


  poweredByHeader: false, // Remove the powered-by header for security
  // Speed up compilation
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 15 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  compress: true,
}

module.exports = nextConfig
