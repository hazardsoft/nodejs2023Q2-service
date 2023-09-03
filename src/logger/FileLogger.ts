import { resolve } from 'node:path';
import { PathLike, WriteStream, createWriteStream, mkdirSync } from 'node:fs';
import { LogWriter } from './interfaces';
import { LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { copyFile, truncate } from 'node:fs/promises';

type FileLoggerConfig = {
  limit: number;
  logsFolder: string;
  errorLogsFileName: string;
  combinedLogsFileName: string;
};

type FileInfo = {
  stream?: WriteStream;
  filePath: string;
};

export class FileLogger implements LogWriter {
  private config: FileLoggerConfig;
  private files: Record<LogLevel, FileInfo>;
  private streams: Map<PathLike, WriteStream> = new Map();
  private bytesWritten: Map<WriteStream, number> = new Map();

  constructor(private readonly configService: ConfigService) {
    this.config = this.readConfig();
    this.files = this.createFileInfos();
    this.createLogsFolder();
  }

  private readConfig(): FileLoggerConfig {
    return {
      limit: (this.configService.get<number>('LOG_LIMIT') ?? 10) * 1024,
      logsFolder: this.configService.get<string>('LOG_FOLDER') ?? 'logs',
      errorLogsFileName:
        this.configService.get<string>('LOG_ERROR_FILE') ?? 'error.log',
      combinedLogsFileName:
        this.configService.get<string>('LOG_COMBINED_FILE') ?? 'combined.log',
    };
  }

  private createLogsFolder(): void {
    const logsFolderPath = resolve(this.config.logsFolder);
    mkdirSync(logsFolderPath, { recursive: true });
  }

  private createFileInfos(): Record<LogLevel, FileInfo> {
    const combinedLogsFileInfo: FileInfo = {
      filePath: resolve(
        this.config.logsFolder,
        this.config.combinedLogsFileName,
      ),
    };
    const errorLogsFileInfo: FileInfo = {
      filePath: resolve(this.config.logsFolder, this.config.errorLogsFileName),
    };

    return {
      debug: combinedLogsFileInfo,
      error: errorLogsFileInfo,
      fatal: combinedLogsFileInfo,
      log: combinedLogsFileInfo,
      verbose: combinedLogsFileInfo,
      warn: combinedLogsFileInfo,
    };
  }

  private hasStream(level: LogLevel): boolean {
    const fileInfo = this.files[level];
    return !!fileInfo.stream;
  }

  private createStream(level: LogLevel): WriteStream {
    const fileInfo = this.files[level];

    if (!this.streams.has(fileInfo.filePath)) {
      const stream = createWriteStream(fileInfo.filePath, {
        flags: 'a',
      });
      this.streams.set(fileInfo.filePath, stream);
      this.bytesWritten.set(stream, 0);
    }
    fileInfo.stream = this.streams.get(fileInfo.filePath)!;
    return fileInfo.stream;
  }

  private getStream(level: LogLevel): WriteStream {
    const fileInfo = this.files[level];
    return fileInfo.stream!;
  }

  async write(message: string, level: LogLevel): Promise<void> {
    const stream: WriteStream = this.hasStream(level)
      ? this.getStream(level)
      : this.createStream(level);
    await this.write_internal(stream, message, level);
  }

  private async write_internal(
    stream: WriteStream,
    message: string,
    level: LogLevel,
  ): Promise<void> {
    const isWritten = stream.write(message, async () => {
      const isRotateLogfile = this.checkIfToRotateLogFile(stream);
      if (isRotateLogfile) {
        await this.rotateLogFile(level);
      }
    });
    if (!isWritten) {
      return new Promise((resolve) => {
        stream.once('drain', resolve);
      }).then(() => {
        this.write_internal(stream, message, level);
      });
    }
  }

  private checkIfToRotateLogFile(stream: WriteStream): boolean {
    const bytesWritten = this.bytesWritten.get(stream)!;
    return stream.bytesWritten - bytesWritten >= this.config.limit;
  }

  private async rotateLogFile(level: LogLevel): Promise<void> {
    const fileInfo = this.files[level];
    const copyPath = `${fileInfo.filePath.slice(
      0,
      -4,
    )}_${this.getFormattedDate()}.log`;
    await copyFile(fileInfo.filePath, copyPath);
    await truncate(fileInfo.filePath, 0);

    const stream = fileInfo.stream!;
    this.bytesWritten.set(stream, stream.bytesWritten);
  }

  private getFormattedDate(): string {
    const now = new Date();
    return `${now.getFullYear()}.${now.getMonth()}.${now.getDay()}T${now.getHours()}.${now.getMinutes()}.${now.getMilliseconds()}`;
  }
}
