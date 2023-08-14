import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { FavsModule } from './favs/favs.module';
import { PrismaModule } from './db/prisma.module';
import { RequestInterceptor } from './request.interceptor';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { AuthExceptionFilter } from './auth/auth.exception.filter';
import { PrismaExceptionFilter } from './db/prisma.exception.filter';
import { HttpExceptionFilter } from './common/http.exception.filter';
import { CommonModule } from './common/CommonModule';
import { CryptoService } from './crypto/crypto.service';
import { CryptoModule } from './crypto/crypto.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavsModule,
    PrismaModule,
    CommonModule,
    CryptoModule,
  ],
  providers: [
    RequestInterceptor,
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    CryptoService,
  ],
  controllers: [AppController],
})
export class AppModule {}
