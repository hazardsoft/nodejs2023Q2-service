import { HttpException, HttpStatus } from '@nestjs/common';

export class ArtistNotFoundError extends HttpException {
  constructor(artistId: string) {
    super(`artist (id ${artistId}) not found`, HttpStatus.NOT_FOUND);
  }
}

export class InvalidArtistId extends HttpException {
  constructor(artistId: string) {
    super(`id ${artistId} is not valid uuid`, HttpStatus.BAD_REQUEST);
  }
}
