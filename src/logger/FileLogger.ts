import { BaseLogger } from './BaseLogger';
import { resolve } from 'node:path';
import { WriteStream, createWriteStream } from 'node:fs';

export class FileLogger extends BaseLogger {
  private writeStream: WriteStream;
  private limitInBytes: number;

  constructor(private readonly limitInKb: number) {
    super();

    this.limitInBytes = limitInKb * 1024;
    this.writeStream = this.createStream(this.getLogPath());
    this.writer = {
      write: async (s: string): Promise<void> => {
        await this.writeLog(s);
      },
    };
  }

  private createStream(path: string): WriteStream {
    const stream = createWriteStream(path, {
      flags: 'a',
    });
    stream.on('data', () => {
      console.log(`*** wrote total: ${stream.bytesWritten}`);
    });
    return stream;
  }

  private getLogPath(): string {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDay()}T${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}-${now.getMilliseconds()}`;
    return resolve(process.cwd(), `./logs/rest_${dateStr}.log`);
  }

  private async writeLog(log: string): Promise<void> {
    const isOk = this.writeStream.write(
      log,
      (error: Error | null | undefined) => {
        if (error) {
          console.error(
            `error occured while writing logs:`,
            JSON.stringify(error),
          );
        }
        if (this.writeStream.bytesWritten >= this.limitInBytes) {
          this.writeStream.end();
          this.writeStream = this.createStream(this.getLogPath());
        }
      },
    );
    if (!isOk) {
      return new Promise((resolve) => {
        this.writeStream.once('drain', resolve);
      }).then(() => {
        this.writeLog(log);
      });
    }
  }
}
