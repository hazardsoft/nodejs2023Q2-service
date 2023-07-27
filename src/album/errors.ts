import { HttpException, HttpStatus } from '@nestjs/common';

export class AlbumNotFoundError extends HttpException {
  constructor(albumId: string) {
    super(`artist (id ${albumId}) not found`, HttpStatus.NOT_FOUND);
  }
}

export class InvalidAlbumId extends HttpException {
  constructor(albumId: string) {
    super(`id ${albumId} is not valid uuid`, HttpStatus.BAD_REQUEST);
  }
}
