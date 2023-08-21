import {
  ArgumentsHost,
  Catch,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import {
  FavoritesCreateError,
  FavoritesDeleteError,
  FavoritesError,
} from '../errors';

@Catch(FavoritesError)
export class FavsExceptionFilter extends BaseExceptionFilter {
  catch(exception: FavoritesError, host: ArgumentsHost) {
    if (exception instanceof FavoritesCreateError) {
      return super.catch(
        new UnprocessableEntityException(exception.message),
        host,
      );
    }
    if (exception instanceof FavoritesDeleteError) {
      return super.catch(new NotFoundException(exception.message), host);
    }
    super.catch(exception, host);
  }
}
