import { Module, forwardRef } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from './roles.guard';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/db/prisma.module';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [LoggerModule, forwardRef(() => UserModule), PrismaModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    RolesGuard,
    AuthService,
    AuthRepository,
  ],
  controllers: [AuthController],
  exports: [LoggerModule],
})
export class AuthModule {}
