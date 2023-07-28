import { HttpException, HttpStatus } from '@nestjs/common';

export type FavType = 'artist' | 'album' | 'track';

export class FavNotFoundError extends HttpException {
  constructor(favId: string, type: FavType) {
    super(`fav ${type} (id ${favId}) not found`, HttpStatus.NOT_FOUND);
  }
}

export class InvalidFavId extends HttpException {
  constructor(favId: string, type: FavType) {
    super(
      `fav ${type} (id ${favId}) does not exist`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
