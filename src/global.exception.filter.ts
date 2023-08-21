import { ArgumentsHost, Catch } from '@nestjs/common';
import ExceptionFilter from './common/base.exception.filter';

@Catch()
export default class GlobalExeptionFilter extends ExceptionFilter<Error> {
  catch(exception: Error, host: ArgumentsHost): void {
    this.handleError({ statusCode: null, message: exception.message }, host);
  }
}
