import pino from 'pino';

const isBrowser = typeof window !== 'undefined';

const browserLogger = {
  info: (...args: any[]) => console.info(...args),
  error: (obj: any, ...args: any[]) => {
    try {
      if (obj instanceof Error) {
        const meta: any = {}
        if ((obj as any).code) meta.code = (obj as any).code
        if ((obj as any).response) meta.status = (obj as any).response?.status
        if ((obj as any).config) meta.url = (obj as any).config?.url

        console.error('Error:', obj.message || 'Unknown error', meta, ...args)
        if (obj.stack) console.error(obj.stack)
      } else if (typeof obj === 'object' && obj !== null) {
        const message = (obj as any).message || JSON.stringify(obj)
        const meta: any = { ...obj }
        delete meta.message
        console.error('Error:', message, meta, ...args)
      } else {
        console.error(obj, ...args)
      }
    } catch (e) {
      // Fallback in case of unexpected formatting issues
      console.error('Error: (logging-failure)', obj, ...args)
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