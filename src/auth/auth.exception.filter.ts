import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import {
  AuthError,
  UnauthorizedError,
  AbsentRefreshTokenError,
} from './errors';
import ExceptionFilter from 'src/common/base.exception.filter';

@Catch(AuthError)
export class AuthExceptionFilter extends ExceptionFilter<AuthError> {
  catch(exception: AuthError, host: ArgumentsHost) {
    if (exception instanceof UnauthorizedError) {
      return this.handleError(
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: exception.message,
        },
        host,
      );
    }
    if (exception instanceof AbsentRefreshTokenError) {
      return this.handleError(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: exception.message,
        },
        host,
      );
    }
    this.handleError({ statusCode: null, message: null }, host);
  }
}
