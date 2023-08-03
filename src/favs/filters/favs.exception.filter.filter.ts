import {
  ArgumentsHost,
  Catch,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FavoritesDoesNotExist, FavoritesError } from '../errors';

@Catch(FavoritesError)
export class FavsExceptionFilter extends BaseExceptionFilter {
  catch(exception: FavoritesError, host: ArgumentsHost) {
    if (exception instanceof FavoritesDoesNotExist) {
      return super.catch(new UnprocessableEntityException(), host);
    }
    super.catch(exception, host);
  }
}
