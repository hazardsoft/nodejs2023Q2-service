import { LogLevel } from '@nestjs/common';

export interface Logger {
  debug(source: string, message: string): void;
  error(source: string, message: string): void;
  log(source: string, message: string): void;
  verbose(source: string, message: string): void;
  warn(source: string, message: string): void;
  setLogLevels(levels: LogLevel[]): void;
}

export type LogHandler = (
  writer: LogWriter,
  source: string,
  message: string,
) => void;

export type LoggerConfig = {
  LOG_LEVEL: LogLevel[];
  LOG_TARGET: LogTarget[];
  LOG_LIMIT: number;
};

export type LogTarget = 'file' | 'stdout';

export type LogWriter = {
  write: (s: string) => Promise<void>;
};
