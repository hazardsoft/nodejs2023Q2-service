import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [LoggerModule],
  exports: [LoggerModule],
})
export class CommonModule {}
