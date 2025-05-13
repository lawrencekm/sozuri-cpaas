import pino from 'pino';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create a browser-safe logger that doesn't try to write to the file system
const browserLogger = {
  info: (...args: any[]) => console.info(...args),
  error: (obj: any, ...args: any[]) => {
    // Handle both object format and simple strings
    if (typeof obj === 'object') {
      console.error('Error:', obj.message || 'Unknown error', obj);
    } else {
      console.error(obj, ...args);
    }
  },
  warn: (...args: any[]) => console.warn(...args),
  debug: (...args: any[]) => console.debug(...args),
  trace: (...args: any[]) => console.trace(...args),
  fatal: (...args: any[]) => console.error('FATAL:', ...args),
};

// Create a server logger only if not in browser
let serverLogger;
if (!isBrowser) {
  try {
    serverLogger = pino({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            level: 'debug',
            options: { colorize: true }
          },
          {
            target: 'pino/file',
            level: 'error',
            options: { destination: 'logs/errors.log' }
          }
        ]
      }
    });
  } catch (e) {
    // Fallback to browser logger if pino fails
    serverLogger = browserLogger;
  }
}

// Export the appropriate logger based on the environment
const logger = isBrowser ? browserLogger : (serverLogger || browserLogger);

export default logger;