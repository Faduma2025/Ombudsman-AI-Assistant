/**
 * Logger Utility
 *
 * Structured logging for knowledge platform operations
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  metadata?: Record<string, any>;
}

export class Logger {
  constructor(private component: string) {}

  debug(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  info(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  error(message: string, error?: Error | any, metadata?: Record<string, any>): void {
    const errorMetadata = {
      ...metadata,
      ...(error && {
        error: {
          message: error.message,
          stack: error.stack,
          ...error
        }
      })
    };

    this.log(LogLevel.ERROR, message, errorMetadata);
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, any>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component: this.component,
      message,
      metadata
    };

    // Console output with color coding
    const color = this.getColor(level);
    const prefix = `${entry.timestamp} [${level}] [${this.component}]`;

    if (metadata && Object.keys(metadata).length > 0) {
      console.log(`${color}${prefix}${this.resetColor} ${message}`, metadata);
    } else {
      console.log(`${color}${prefix}${this.resetColor} ${message}`);
    }
  }

  private getColor(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return '\x1b[36m'; // Cyan
      case LogLevel.INFO:
        return '\x1b[32m'; // Green
      case LogLevel.WARN:
        return '\x1b[33m'; // Yellow
      case LogLevel.ERROR:
        return '\x1b[31m'; // Red
      default:
        return '';
    }
  }

  private get resetColor(): string {
    return '\x1b[0m';
  }
}

/**
 * Create a logger for a component
 */
export function createLogger(component: string): Logger {
  return new Logger(component);
}
