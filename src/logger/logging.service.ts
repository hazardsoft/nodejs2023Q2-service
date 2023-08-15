import { Injectable, LogLevel, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogTarget, Logger, LoggerConfig } from './interfaces';
import { FileLogger } from './FileLogger';
import { StdOutLogger } from './StdOutLogger';

@Injectable()
export class LoggingService implements LoggerService {
  private config: LoggerConfig;
  private loggers: Logger[];

  constructor(private readonly configService: ConfigService) {
    this.config = this.readConfig();
    this.setTargets(this.config.LOG_TARGET);
    this.setLogLevels(this.config.LOG_LEVEL);
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
      LOG_LEVEL: levels ?? ['verbose'],
      LOG_TARGET: targets ?? ['stdout'],
      LOG_LIMIT: limit ?? 1,
    };
  }

  log(message: any, ...optionalParams: any[]) {
    this.loggers.forEach((l) => l.log(optionalParams.join(','), message));
  }
  error(message: any, ...optionalParams: any[]) {
    this.loggers.forEach((l) => l.error(optionalParams.join(','), message));
  }
  warn(message: any, ...optionalParams: any[]) {
    this.loggers.forEach((l) => l.warn(optionalParams.join(','), message));
  }
  debug?(message: any, ...optionalParams: any[]) {
    this.loggers.forEach((l) => l.debug(optionalParams.join(','), message));
  }
  verbose?(message: any, ...optionalParams: any[]) {
    this.loggers.forEach((l) => l.verbose(optionalParams.join(','), message));
  }
  setLogLevels?(levels: LogLevel[]): void {
    this.loggers.forEach((l) => l.setLogLevels(levels));
  }

  setTargets(targets: LogTarget[]): void {
    this.loggers = targets.map((t) => {
      switch (t) {
        case 'file':
          return new FileLogger(this.config.LOG_LIMIT);
        case 'stdout':
          return new StdOutLogger();
      }
    });
  }
}
