import { LogLevel } from '@nestjs/common';
import { LogHandler, LogWriter, Logger } from './interfaces';
import { EOL } from 'node:os';

const formatMessage = (source: string, message: string): string => {
  const formatted = `[${source}] - ${message}${EOL}`;
  return formatted;
};

const debugHandler: LogHandler = (
  writer: LogWriter,
  source: string,
  message: string,
) => {
  writer.write(formatMessage(source, message));
};
const errorHandler: LogHandler = (
  writer: LogWriter,
  source: string,
  message: string,
) => {
  writer.write(formatMessage(source, message));
};
const logHandler: LogHandler = (
  writer: LogWriter,
  source: string,
  message: string,
) => {
  writer.write(formatMessage(source, message));
};
const verboseHandler: LogHandler = (
  writer: LogWriter,
  source: string,
  message: string,
) => {
  writer.write(formatMessage(source, message));
};
const warnHandler: LogHandler = (
  writer: LogWriter,
  source: string,
  message: string,
) => {
  writer.write(formatMessage(source, message));
};

const handlers: Record<LogLevel, LogHandler> = {
  debug: debugHandler,
  error: errorHandler,
  log: logHandler,
  verbose: verboseHandler,
  warn: warnHandler,
} as const;

export abstract class BaseLogger implements Logger {
  writer: LogWriter;
  private activeHandlers: Record<LogLevel, LogHandler> = { ...handlers };

  debug(source: string, message: string): void {
    this.write('debug', source, message);
  }
  error(source: string, message: string): void {
    this.write('error', source, message);
  }
  log(source: string, message: string): void {
    this.write('log', source, message);
  }
  verbose(source: string, message: string): void {
    this.write('verbose', source, message);
  }
  warn(source: string, message: string): void {
    this.write('warn', source, message);
  }

  write(level: LogLevel, source: string, message: string): void {
    const logHandler = this.activeHandlers[level];
    if (logHandler) {
      logHandler(this.writer, source, message);
    }
  }

  setLogLevels(levels: LogLevel[]): void {
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
