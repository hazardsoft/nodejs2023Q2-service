import { LogLevel } from '@nestjs/common';

export type LoggerConfig = {
  logLevels: LogLevel[];
  logTargets: LogTarget[];
};

export type LogTarget = 'file' | 'stdout';

export const LogLevelValues: Record<LogLevel, number> = {
  debug: 0,
  verbose: 1,
  log: 2,
  warn: 3,
  error: 4,
  fatal: 5,
} as const;

export type LogWriter = {
  write: (message: string, level: LogLevel) => Promise<void>;
};
