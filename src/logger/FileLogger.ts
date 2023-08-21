import { resolve } from 'node:path';
import { WriteStream, createWriteStream } from 'node:fs';
import { LogWriter } from './interfaces';
import { LogLevel } from '@nestjs/common';

export class FileLogger implements LogWriter {
  private streams: Record<Partial<LogLevel>, WriteStream>;
  private limitInBytes: number;

  constructor(private readonly limitInKb: number) {
    this.limitInBytes = limitInKb * 1024;

    const allStream = this.createStream(this.getLogPath());
    const errorStream = this.createStream(this.getLogPath('error'));
    this.streams = {
      log: allStream,
      debug: allStream,
      warn: allStream,
      verbose: allStream,
      error: errorStream,
    };
  }

  async write(message: string, level: LogLevel): Promise<void> {
    const stream: WriteStream = this.streams[level];
    await this.write_internal(stream, message, level);

    // 'error' log level is writtem to common log as well
    if (level === 'error') {
      const allStream: WriteStream = this.streams['verbose'];
      await this.write_internal(allStream, message, level);
    }
  }

  private async write_internal(
    stream: WriteStream,
    message: string,
    level: LogLevel,
  ): Promise<void> {
    const isOk = stream.write(message, (error: Error | null | undefined) => {
      if (error) {
        console.error(
          `error occured while writing logs:`,
          JSON.stringify(error),
        );
      }
      if (stream.bytesWritten >= this.limitInBytes) {
        stream.end();
        this.streams[level] = this.createStream(this.getLogPath(level));
      }
    });
    if (!isOk) {
      return new Promise((resolve) => {
        stream.once('drain', resolve);
      }).then(() => {
        this.write_internal(stream, message, level);
      });
    }
  }

  private createStream(path: string): WriteStream {
    const stream = createWriteStream(path, {
      flags: 'a',
    });
    return stream;
  }

  private getLogPath(level: LogLevel = 'debug'): string {
    const date = new Date();
    const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}T${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${date.getMilliseconds()}`;
    return resolve(`./logs/${dateStr}_${level}.log`);
  }
}
