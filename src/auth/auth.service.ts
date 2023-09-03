import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Auth } from './entity/auth.entity';
import { UserService } from 'src/user/user.service';
import { SignupDto } from './dto/signup.dto';
import {
  ExpiredTokenError,
  InvalidRefreshTokenError,
  UnauthorizedError,
} from './errors';
import { User } from 'src/user/entities/user.entity';
import { RefreshTokenDto } from './dto/refresh.dto';
import { plainToInstance } from 'class-transformer';
import { CryptoService } from 'src/crypto/crypto.service';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
  ) {}

  async signup(dto: SignupDto): Promise<User> {
    return this.userService.create({ ...dto });
  }

  async login(dto: LoginDto): Promise<Auth> {
    const isPasswordMatch = await this.userService.isPasswordMatch(
      dto.login,
      dto.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedError();
    }
    const user = await this.userService.findOneByLogin(dto.login);
    const payload = { userId: user.id, login: user.login };
    const [accessToken, refreshToken] =
      await this.cryptoService.generateTokens(payload);

    return plainToInstance(Auth, {
      accessToken,
      refreshToken,
    });
  }

  async refresh(dto: RefreshTokenDto): Promise<Auth> {
    try {
      const payload = await this.cryptoService.verifyRefreshToken(
        dto.refreshToken,
      );
      const [accessToken, refreshToken] =
        await this.cryptoService.generateTokens(payload);
      return plainToInstance(Auth, {
        accessToken,
        refreshToken,
      });
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new ExpiredTokenError();
      }
      throw new InvalidRefreshTokenError();
    }
  }
}
