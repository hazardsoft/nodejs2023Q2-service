import { LoggingService } from '../logger/logging.service';
import {
  ArgumentsHost,
  ExceptionFilter as NestExceptionFilter,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';

export type CommonError = {
  statusCode: number;
  message: string;
};

export default abstract class ExceptionFilter<T>
  implements NestExceptionFilter<T>
{
  @Inject()
  private readonly logger: LoggingService;

  abstract catch(exception: T, host: ArgumentsHost): void;

  handleError(error: CommonError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const responseBody = {
      statusCode: error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message ?? 'Internal Server Error',
    };

    this.logger.error(
      `error: ${JSON.stringify(responseBody)}`,
      ExceptionFilter.name,
    );

    response.status(responseBody.statusCode).json(responseBody);
  }
}
