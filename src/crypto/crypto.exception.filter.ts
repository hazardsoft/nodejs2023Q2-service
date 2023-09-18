import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { CryptoError, ExpiredAccessTokenError } from './errors';
import ExceptionFilter from 'src/common/base.exception.filter';
import {
  ExpiredRefreshTokenError,
  InvalidAccessTokenError,
  InvalidRefreshTokenError,
} from './errors';

@Catch(CryptoError)
export class CryptoExceptionFilter extends ExceptionFilter<CryptoError> {
  catch(exception: CryptoError, host: ArgumentsHost) {
    if (
      exception instanceof ExpiredRefreshTokenError ||
      exception instanceof InvalidRefreshTokenError
    ) {
      return this.handleError(
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: exception.message,
        },
        host,
      );
    }
    if (
      exception instanceof InvalidAccessTokenError ||
      exception instanceof ExpiredAccessTokenError
    ) {
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
