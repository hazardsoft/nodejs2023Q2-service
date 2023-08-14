import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import {
  FavoritesCreateError,
  FavoritesDeleteError,
  FavoritesError,
} from '../errors';
import BaseExceptionFilter from 'src/common/base.exception.filter';

@Catch(FavoritesError)
export class FavsExceptionFilter extends BaseExceptionFilter<FavoritesError> {
  catch(exception: FavoritesError, host: ArgumentsHost) {
    if (exception instanceof FavoritesCreateError) {
      this.handleError(
        {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: exception.message,
        },
        host,
      );
    }
    if (exception instanceof FavoritesDeleteError) {
      return this.handleError(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: exception.message,
        },
        host,
      );
    }
    this.handleError({ statusCode: null, message: null }, host);
  }
}
