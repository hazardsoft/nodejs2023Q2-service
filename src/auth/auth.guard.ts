import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { LoggingService } from 'src/logger/logging.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly logger: LoggingService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    return this.validateRequest(request);
  }

  private validateRequest(request: Request): boolean {
    // TODO: add token validation and add authenticated user to request

    this.logger.warn(
      `non-authenticated request: ${request.url}`,
      AuthGuard.name,
    );

    return true;
  }
}
