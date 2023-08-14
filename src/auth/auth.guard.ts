import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { LoggingService } from 'src/logger/logging.service';
import { InvalidTokenError, UnauthorizedError } from './errors';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTH_META } from './decorators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly logger: LoggingService,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.get<boolean>(
      SKIP_AUTH_META,
      context.getHandler(),
    );
    this.logger.debug(`skip auth: ${Boolean(skipAuth)}`, AuthGuard.name);
    if (skipAuth) {
      return true;
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) {
      throw new InvalidTokenError();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      this.logger.debug(
        `authentication verified: ${JSON.stringify(payload)}`,
        AuthGuard.name,
      );
    } catch (e) {
      this.logger.error(
        `authentication failed: ${JSON.stringify(e)}`,
        AuthGuard.name,
      );
      throw new UnauthorizedError();
    }

    return true;
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
