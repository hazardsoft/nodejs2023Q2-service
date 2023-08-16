import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, JwtModule],
  providers: [CryptoService],
  exports: [CryptoService, JwtModule],
})
export class CryptoModule {}
