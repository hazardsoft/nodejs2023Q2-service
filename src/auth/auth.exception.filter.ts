import { ArgumentsHost, Catch, UnauthorizedException } from '@nestjs/common';
import { AuthError, UnauthorizedError } from './errors';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(AuthError)
export class AuthExceptionFilter extends BaseExceptionFilter {
  catch(exception: AuthError, host: ArgumentsHost) {
    if (exception instanceof UnauthorizedError) {
      return super.catch(new UnauthorizedException(exception.message), host);
    }
    super.catch(exception, host);
  }
}
