import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import UserRepository from './user.repository';
import { PrismaModule } from 'src/db/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/CommonModule';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    CommonModule,
    CryptoModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
