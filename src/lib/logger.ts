type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const isDev = process.env.NODE_ENV !== 'production'

function log(level: LogLevel, ...args: unknown[]) {
  if (level === 'debug' && !isDev) return
  const prefix = {
    debug: '🐞',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌'
  }[level]
  console[level === 'debug' ? 'log' : level](prefix, ...args)
}

export const logger = {
  debug: (...args: unknown[]) => log('debug', ...args),
  info: (...args: unknown[]) => log('info', ...args),
  warn: (...args: unknown[]) => log('warn', ...args),
  error: (...args: unknown[]) => log('error', ...args),
}
