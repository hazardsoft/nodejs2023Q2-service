import { Module, forwardRef } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { CommonModule } from 'src/common/CommonModule';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
  imports: [forwardRef(() => UserModule), CommonModule, CryptoModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
