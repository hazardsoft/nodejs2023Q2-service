import { LoggingService } from '../logger/logging.service';
import {
  ArgumentsHost,
  ExceptionFilter as NestExceptionFilter,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

export type CommonError = {
  statusCode: number | null;
  message: string | null;
};

type ResponseBody = {
  statusCode: number;
  message: string | null;
};

export default abstract class ExceptionFilter<T>
  implements NestExceptionFilter<T>
{
  @Inject()
  private readonly logger: LoggingService;

  @Inject()
  private readonly httpAdapterHost: HttpAdapterHost;

  abstract catch(exception: T, host: ArgumentsHost): void;

  handleError(error: CommonError, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const responseBody: ResponseBody = error.statusCode
      ? {
          statusCode: error.statusCode,
          message: error.message,
        }
      : {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal Server Error',
        };

    this.logger.error(
      `error: ${JSON.stringify(responseBody)}`,
      ExceptionFilter.name,
    );

    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }
}
