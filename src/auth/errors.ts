export class AuthError extends Error {}

export class UnauthorizedError extends AuthError {
  constructor() {
    super('User is not authorized');
  }
}

export class InvalidTokenError extends AuthError {
  constructor() {
    super('Auth token is invalid');
  }
}
