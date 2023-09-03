import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { InvalidAccessTokenError } from './errors';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTH_META } from './decorators';
import { CryptoService } from 'src/crypto/crypto.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.get<boolean>(
      SKIP_AUTH_META,
      context.getHandler(),
    );
    if (skipAuth) {
      return true;
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) {
      throw new InvalidAccessTokenError();
    }
    try {
      await this.cryptoService.verifyAccessToken(token);
    } catch (e) {
      throw new InvalidAccessTokenError();
    }

    return true;
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
