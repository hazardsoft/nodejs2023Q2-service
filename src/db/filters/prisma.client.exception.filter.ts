import { ArgumentsHost, Catch, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaErrors } from '../errors';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    switch (exception.code) {
      case PrismaErrors.NOT_FOUND:
        super.catch(new NotFoundException(), host);
        break;
      default:
        super.catch(exception, host);
    }
  }
}
