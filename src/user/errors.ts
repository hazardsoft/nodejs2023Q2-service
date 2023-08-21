export class UserError extends Error {}

export class IncorrectPasswordError extends UserError {
  constructor() {
    super('incorrect password');
  }
}
