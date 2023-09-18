import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { TokenExpiredError } from 'jsonwebtoken';
import {
  ExpiredAccessTokenError,
  ExpiredRefreshTokenError,
  InvalidAccessTokenError,
  InvalidRefreshTokenError,
} from './errors';

type CryptoConfig = {
  saltRounds: number;
  accessTokenSecurityKey: string;
  accessTokenExpiresIn: string;
  refreshTokenSecurityKey: string;
  refreshTokenExpiresIn: string;
};

export type JwtTokenPayload = {
  userId: string;
  login: string;
};

@Injectable()
export class CryptoService {
  private config: CryptoConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.config = this.readConfig();
  }

  private readConfig(): CryptoConfig {
    return {
      saltRounds: Number(this.configService.get<number>('CRYPT_SALT')),
      accessTokenSecurityKey: String(
        this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
      ),
      accessTokenExpiresIn: String(
        this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
      ),
      refreshTokenSecurityKey: String(
        this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      ),
      refreshTokenExpiresIn: String(
        this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
      ),
    };
  }

  async isPasswordMatch(password: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.config.saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async generateTokens(
    payload: JwtTokenPayload,
  ): Promise<[accessToken: string, refreshToken: string]> {
    const {
      accessTokenSecurityKey,
      accessTokenExpiresIn,
      refreshTokenSecurityKey,
      refreshTokenExpiresIn,
    } = this.config;

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: accessTokenSecurityKey,
      expiresIn: accessTokenExpiresIn,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshTokenSecurityKey,
      expiresIn: refreshTokenExpiresIn,
    });
    return [accessToken, refreshToken];
  }

  async verifyAccessToken(token: string): Promise<JwtTokenPayload> {
    try {
      const { userId, login } =
        await this.jwtService.verifyAsync<JwtTokenPayload>(token, {
          secret: this.config.accessTokenSecurityKey,
        });
      return { userId, login };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ExpiredAccessTokenError();
      }
      throw new InvalidAccessTokenError();
    }
  }

  async verifyRefreshToken(token: string): Promise<JwtTokenPayload> {
    try {
      const { userId, login } =
        await this.jwtService.verifyAsync<JwtTokenPayload>(token, {
          secret: this.config.refreshTokenSecurityKey,
        });
      return { userId, login };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ExpiredRefreshTokenError();
      }
      throw new InvalidRefreshTokenError();
    }
  }
}
