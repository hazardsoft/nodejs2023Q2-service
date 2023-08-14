import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [LoggerModule, ConfigModule],
  exports: [LoggerModule, ConfigModule],
})
export class CommonModule {}
