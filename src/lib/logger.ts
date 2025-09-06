/**
 * Centralized logging utility that respects NODE_ENV
 * In production, only critical errors are logged to console
 */
interface LogLevel {
  ERROR: number;
  WARN: number;
  INFO: number;
  DEBUG: number;
}

const LOG_LEVELS: LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const getCurrentLogLevel = (): number => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return LOG_LEVELS.ERROR;
    case 'staging':
      return LOG_LEVELS.WARN;
    case 'test':
      return LOG_LEVELS.ERROR;
    default:
      return LOG_LEVELS.DEBUG;
  }
};

const currentLogLevel = getCurrentLogLevel();

class Logger {
  private shouldLog(level: number): boolean {
    return level <= currentLogLevel;
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog(LOG_LEVELS.ERROR)) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LOG_LEVELS.WARN)) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog(LOG_LEVELS.INFO)) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  // Special method for security events - always logs
  security(message: string, ...args: any[]): void {
    console.error(`[SECURITY] ${message}`, ...args);
  }
}

export const logger = new Logger();
export default logger;