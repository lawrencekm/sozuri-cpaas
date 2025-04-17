import pino from 'pino'

const logger = pino({
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
})

export default logger