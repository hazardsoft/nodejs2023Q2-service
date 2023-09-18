export class CryptoError extends Error {}

export class ExpiredRefreshTokenError extends CryptoError {
  constructor() {
    super('Refresh token is expired');
  }
}
export class ExpiredAccessTokenError extends CryptoError {
  constructor() {
    super('Access token is expired');
  }
}

export class InvalidAccessTokenError extends CryptoError {
  constructor() {
    super('Access token is invalid');
  }
}

export class InvalidRefreshTokenError extends CryptoError {
  constructor() {
    super('Refresh token is invalid');
  }
}
