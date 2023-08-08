import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundError extends HttpException {
  constructor(userId: string) {
    super(`user (id ${userId}) not found`, HttpStatus.NOT_FOUND);
  }
}
export class IncorrectPasswordError extends HttpException {
  constructor() {
    super('incorrect password', HttpStatus.FORBIDDEN);
  }
}

export class InvalidUserId extends HttpException {
  constructor(userId: string) {
    super(`id ${userId} is not valid uuid`, HttpStatus.BAD_REQUEST);
  }
}
