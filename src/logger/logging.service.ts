import { Injectable, LogLevel, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  LogLevelValues,
  LogTarget,
  LogWriter,
  LoggerConfig,
} from './interfaces';
import { FileLogger } from './FileLogger';
import { StdOutLogger } from './StdOutLogger';
import { EOL } from 'node:os';

@Injectable()
export class LoggingService implements LoggerService {
  private config: LoggerConfig;
  private loggers: LogWriter[];

  constructor(private readonly configService: ConfigService) {
    this.config = this.readConfig();
    this.setTargets(this.config.logTargets);
    this.setLogLevels(this.config.logLevels);

    process.addListener('uncaughtException', (error: Error, origin: string) => {
      this.error(
        `Uncaught exception: ${JSON.stringify(error)}, origin: ${origin}`,
        LoggingService.name,
      );
      process.exit(1);
    });
    process.addListener(
      'unhandledRejection',
      (reason: Error | unknown, promise: Promise<unknown>) => {
        this.error(
          `Unhandled rejection, promise: ${JSON.stringify(
            promise,
          )}, reason: ${reason}`,
          LoggingService.name,
        );
      },
    );
  }

  private readConfig(): LoggerConfig {
    const levels = this.configService
      .get<string>('LOG_LEVEL')
      .split(',') as LogLevel[];

    const targets = this.configService
      .get<string>('LOG_TARGET')
      .split(',') as LogTarget[];

    const limit = this.configService.get<number>('LOG_LIMIT');

    return {
      logLevels: levels ?? ['verbose'],
      logTargets: targets ?? ['stdout'],
      logLimit: limit ?? 100,
    };
  }

  formatMessage = (
    context: string,
    message: string,
    level: LogLevel,
  ): string => {
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}(${now.getMilliseconds()})`;
    const formatted = `${time} - [${context}] - [${level.toUpperCase()}] - ${message}${EOL}`;
    return formatted;
  };

  writeLog(context: string, message: string, level: LogLevel): void {
    this.loggers.forEach((l) =>
      l.write(this.formatMessage(context, message, level), level),
    );
  }

  log(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled('log')) {
      return;
    }
    this.writeLog(optionalParams.join(','), message, 'log');
  }
  error(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled('error')) {
      return;
    }
    this.writeLog(optionalParams.join(','), message, 'error');
  }
  warn(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled('warn')) {
      return;
    }
    this.writeLog(optionalParams.join(','), message, 'warn');
  }
  debug(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled('debug')) {
      return;
    }
    this.writeLog(optionalParams.join(','), message, 'debug');
  }
  verbose?(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled('verbose')) {
      return;
    }
    this.writeLog(optionalParams.join(','), message, 'verbose');
  }
  setLogLevels?(levels: LogLevel[]): void {
    this.config.logLevels = levels;
  }
  setTargets(targets: LogTarget[]): void {
    this.loggers = targets.map((t) => {
      switch (t) {
        case 'file':
          return new FileLogger(this.config.logLimit);
        case 'stdout':
          return new StdOutLogger();
      }
    });
  }
  private isLevelEnabled(level: LogLevel): boolean {
    if (this.config.logLevels.includes(level)) {
      return true;
    }
    const highestLogLevelValue = this.config.logLevels
      .map((level) => LogLevelValues[level])
      .sort((a, b) => b - a)?.[0];

    const targetLevelValue = LogLevelValues[level];
    return targetLevelValue >= highestLogLevelValue;
  }
}
