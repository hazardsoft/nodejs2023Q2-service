import { BaseLogger } from './BaseLogger';

export class StdOutLogger extends BaseLogger {
  constructor() {
    super();
    this.writer = {
      write: async (s: string): Promise<void> => {
        process.stdout.write(s);
      },
    };
  }
}
