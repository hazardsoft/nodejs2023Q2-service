import { Injectable, LogLevel, LoggerService } from '@nestjs/common';

type LogHandler = (message: string, ...args) => void;

const formatMessage = (message: string, ...args): string => {
  const formatted =
    args && args.length ? `[${args.join(':')}] - ${message}` : `${message}`;
  return formatted;
};

const debugHandler: LogHandler = (message: string, ...args) => {
  console.debug(formatMessage(message, args));
};
const errorHandler: LogHandler = (message: string, ...args) => {
  console.error(formatMessage(message, args));
};
const logHandler: LogHandler = (message: string, ...args) => {
  console.log(formatMessage(message, args));
};
const verboseHandler: LogHandler = (message: string, ...args) => {
  console.log(formatMessage(message, args));
};
const warnHandler: LogHandler = (message: string, ...args) => {
  console.warn(formatMessage(message, args));
};

const handlers: Record<LogLevel, LogHandler> = {
  debug: debugHandler,
  error: errorHandler,
  log: logHandler,
  verbose: verboseHandler,
  warn: warnHandler,
};

@Injectable()
export class LoggingService implements LoggerService {
  private activeHandlers: Record<LogLevel, LogHandler> = { ...handlers };

  log(message: any, ...optionalParams: any[]) {
    this.activeHandlers['log']?.apply(this, [message, ...optionalParams]);
  }
  error(message: any, ...optionalParams: any[]) {
    this.activeHandlers['error']?.apply(this, [message, ...optionalParams]);
  }
  warn(message: any, ...optionalParams: any[]) {
    this.activeHandlers['warn']?.apply(this, [message, ...optionalParams]);
  }
  debug?(message: any, ...optionalParams: any[]) {
    this.activeHandlers['debug']?.apply(this, [message, ...optionalParams]);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    this.activeHandlers['verbose']?.apply(this, [message, ...optionalParams]);
  }
  setLogLevels?(levels: LogLevel[]) {
    if (levels.includes('verbose')) {
      this.activeHandlers = { ...handlers };
    } else {
      Object.keys(handlers).forEach((logLevel) => {
        if (levels.includes(logLevel as LogLevel)) {
          this.activeHandlers[logLevel] = handlers[logLevel];
        } else {
          delete this.activeHandlers[logLevel];
        }
      });
    }
  }
}
