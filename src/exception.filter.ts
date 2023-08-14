import { LoggingService } from './logger/logging.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpServer,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaErrors } from './db/errors';

@Catch()
export default class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggingService,
    private readonly httpServer: HttpServer,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    let statusCode = 0;
    let message = '';

    if (exception instanceof PrismaClientKnownRequestError) {
      switch (exception.code) {
        case PrismaErrors.NOT_FOUND:
          statusCode = HttpStatus.NOT_FOUND;
          message = 'Not found';
          break;
      }
    }
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
    }

    statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    message = message || 'Internal Server Error';

    const responseBody = { statusCode, message };

    this.logger.error(
      `error: ${JSON.stringify(responseBody)}`,
      GlobalExceptionFilter.name,
    );

    this.httpServer.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
