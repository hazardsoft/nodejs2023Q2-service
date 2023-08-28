import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaErrors } from './errors';
import BaseExceptionFilter from 'src/common/base.exception.filter';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter<PrismaClientKnownRequestError> {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    switch (exception.code) {
      case PrismaErrors.NOT_FOUND:
        this.handleError(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Not found',
          },
          host,
        );
        break;
      default:
        this.handleError({ statusCode: null, message: null }, host);
    }
  }
}
