import { CookieSerializeOptions } from '@fastify/cookie';

export const TYPE_TOKEN_BEARER = 'Bearer';

export const setCookieOptions: CookieSerializeOptions = {
  httpOnly: true, // Prevents client-side JS from accessing the cookie.
  secure: true, // Only send over HTTPS in production. (Except localhost during development).
  sameSite: 'none', // sameSite: 'strict', to Prevents CSRF attacks
  maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration (7 days)
  path: '/', // Or a more specific path like '/api/auth/refresh-tokens'
};
