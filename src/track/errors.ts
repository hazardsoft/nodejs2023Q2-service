import { HttpException, HttpStatus } from '@nestjs/common';

export class TrackNotFoundError extends HttpException {
  constructor(trackId: string) {
    super(`track (id ${trackId}) not found`, HttpStatus.NOT_FOUND);
  }
}

export class InvalidTrackId extends HttpException {
  constructor(trackId: string) {
    super(`id ${trackId} is not valid uuid`, HttpStatus.BAD_REQUEST);
  }
}
