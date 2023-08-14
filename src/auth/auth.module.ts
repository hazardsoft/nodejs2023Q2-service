import { Module, forwardRef } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from './roles.guard';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { CommonModule } from 'src/common/CommonModule';

@Module({
  imports: [
    forwardRef(() => UserModule),
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
    CommonModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AuthService,
  ],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
