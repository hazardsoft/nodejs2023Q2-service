import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import ExceptionFilter from './base.exception.filter';

@Catch(HttpException)
export class HttpExceptionFilter extends ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    this.handleError(
      { statusCode: exception.getStatus(), message: exception.message },
      host,
    );
  }
}
