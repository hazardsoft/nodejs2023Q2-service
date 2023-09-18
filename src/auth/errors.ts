export class AuthError extends Error {}

export class UnauthorizedError extends AuthError {
  constructor() {
    super('User is not authorized');
  }
}

export class AbsentRefreshTokenError extends AuthError {
  constructor() {
    super('Refresh token is missing');
  }
}
