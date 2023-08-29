export class AuthError extends Error {}

export class UnauthorizedError extends AuthError {
  constructor() {
    super('User is not authorized');
  }
}

export class InvalidRefreshTokenError extends AuthError {
  constructor() {
    super('Refresh token is invalid');
  }
}

export class InvalidAccessTokenError extends AuthError {
  constructor() {
    super('Access token is invalid');
  }
}

export class ExpiredTokenError extends AuthError {
  constructor() {
    super('Auth token is expired');
  }
}
