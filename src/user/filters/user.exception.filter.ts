import { ArgumentsHost, Catch, ForbiddenException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { IncorrectPasswordError, UserError } from '../errors';

@Catch(UserError)
export class UserExceptionFilter extends BaseExceptionFilter {
  catch(exception: UserError, host: ArgumentsHost) {
    if (exception instanceof IncorrectPasswordError) {
      return super.catch(new ForbiddenException(), host);
    }
    super.catch(exception, host);
  }
}
