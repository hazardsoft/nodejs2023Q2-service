import { Module, forwardRef } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from './roles.guard';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/db/prisma.module';
import { AuthRepository } from './auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    LoggerModule,
    forwardRef(() => UserModule),
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          signOptions: {
            expiresIn: configService.get<string>('TOKEN_EXPIRE_TIME'),
          },
          secret: configService.get<string>('JWT_SECRET_KEY'),
        };
      },
    }),
  ],
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
  exports: [LoggerModule, JwtModule],
})
export class AuthModule {}
