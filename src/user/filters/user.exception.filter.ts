import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { IncorrectPasswordError, UserError } from '../errors';
import ExceptionFilter from 'src/common/base.exception.filter';

@Catch(UserError)
export class UserExceptionFilter extends ExceptionFilter<UserError> {
  catch(exception: UserError, host: ArgumentsHost) {
    if (exception instanceof IncorrectPasswordError) {
      return this.handleError(
        { statusCode: HttpStatus.FORBIDDEN, message: exception.message },
        host,
      );
    }
    this.handleError({ statusCode: null, message: null }, host);
  }
}
