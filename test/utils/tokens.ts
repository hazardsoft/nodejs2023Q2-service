import { sign, SignOptions } from 'jsonwebtoken';
import 'dotenv/config';

const refreshTokenSecurityKey = process.env.REFRESH_TOKEN_SECRET_KEY || '';

const generateRefreshToken = (payload: any, options: SignOptions): string => {
  return sign(payload, refreshTokenSecurityKey, options);
};

export default generateRefreshToken;
