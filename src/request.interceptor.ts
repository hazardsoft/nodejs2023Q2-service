import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from './logger/logging.service';
import { Request, Response } from 'express';
import { EOL } from 'node:os';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggingService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const now = Date.now();
    const requestLog = `Request: url: ${request.url}(${
      request.method
    }), query params ${JSON.stringify(request.query)}, body: ${JSON.stringify(
      request.body,
    )}`;
    const responseLog = `Response: status code ${response.statusCode}`;

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        this.logger.debug(
          `${duration}ms${EOL}\t${requestLog}${EOL}\t${responseLog}`,
          RequestInterceptor.name,
        );
      }),
    );
  }
}
