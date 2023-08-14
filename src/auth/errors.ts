export class AuthError extends Error {}

export class UnauthorizedError extends AuthError {
  constructor() {
    super('User is not authorized');
  }
}
