/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    webpackMemoryOptimizations: true,
    optimizeCss: true,
    optimizePackageImports: [
      'recharts',
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs'
    ],
    serverActions: {
      allowedOrigins: ['localhost:3000']
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['app', 'components', 'lib', 'hooks'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    domains: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Webpack config (fallback for when Turbopack is not used)
  webpack: (config, { isServer, dev }) => {
    if (!dev || process.env.DISABLE_TURBOPACK === 'true') {
      config.parallelism = 1;

      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        'worker_threads': path.resolve(__dirname, 'lib/worker-threads-mock.js'),
        os: false,
        child_process: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        './lib/worker.js': path.resolve(__dirname, 'lib/worker-shim.js'),
        '../lib/worker.js': path.resolve(__dirname, 'lib/worker-shim.js'),
        '../../lib/worker.js': path.resolve(__dirname, 'lib/worker-shim.js')
      };

      if (isServer) {
        config.resolve.alias = {
          ...config.resolve.alias,
          'worker_threads': path.resolve(__dirname, 'lib/worker-threads-mock.js'),
          './lib/worker.js': path.resolve(__dirname, 'lib/worker-shim.js'),
          '../lib/worker.js': path.resolve(__dirname, 'lib/worker-shim.js'),
          '../../lib/worker.js': path.resolve(__dirname, 'lib/worker-shim.js'),
        };

        config.plugins = config.plugins.filter(plugin =>
          !plugin.constructor.name.includes('Worker') &&
          !plugin.constructor.name.includes('Thread')
        );

        config.plugins.push({
          apply: (compiler) => {
            compiler.hooks.afterEmit.tap('CopyWorkerShimPlugin', () => {
              const fs = require('fs');
              const path = require('path');

              // Copy to multiple locations to ensure compatibility
              const outputDirs = [
                path.resolve(__dirname, '.next/server/lib'),
                path.resolve(__dirname, '.next/server/vendor-chunks/lib'),
                path.resolve(__dirname, '.next/server/chunks/lib'),
                path.resolve(__dirname, '.next/server/vendor-chunks'),
                path.resolve(__dirname, '.next/server/chunks')
              ];

              outputDirs.forEach(outputDir => {
                if (!fs.existsSync(outputDir)) {
                  fs.mkdirSync(outputDir, { recursive: true });
                }

                const workerSource = path.resolve(__dirname, 'lib/worker-shim.js');
                const workerDest = path.resolve(outputDir, 'worker.js');

                try {
                  fs.copyFileSync(workerSource, workerDest);
                } catch (err) {
                  // Ignore errors for non-critical copies
                }

                const mockSource = path.resolve(__dirname, 'lib/worker-threads-mock.js');
                const mockDest = path.resolve(outputDir, 'worker-threads-mock.js');

                try {
                  fs.copyFileSync(mockSource, mockDest);
                } catch (err) {
                  // Ignore errors for non-critical copies
                }
              });
            });
          }
        });
      }

      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 10,
        cacheGroups: {
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            name: 'react',
            priority: 40,
          },
          recharts: {
            test: /[\\/]node_modules[\\/](recharts|d3)[\\/]/,
            name: 'recharts',
            priority: 30,
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix',
            priority: 20,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
          },
        },
      };
    }

    return config;
  },

  poweredByHeader: false,
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 2,
  },
  compress: true,
}

module.exports = nextConfig;
