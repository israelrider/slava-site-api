import { config } from 'dotenv';

config();

export interface JwtConfig {
  secret: string;
  audience?: string;
  issuer?: string;
  accessTokenTtl?: number;
  refreshTokenTtl?: number;
}

export const jwtConfig: JwtConfig = {
  secret: process.env.JWT_SECRET_KEY,
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
  accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL, 10),
  refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL, 10),
};
