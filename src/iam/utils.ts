import { CookieSerializeOptions } from '@fastify/cookie';
import { AccountUser } from '@/users/interfaces/account-user.interface'
import { User } from '@/users/models/user.model'
import { Role } from '@/iam/enums/roles.enum'

export const setCookieOptions: CookieSerializeOptions = {
  httpOnly: true, // Prevents client-side JS from accessing the cookie.
  secure: true, // Only send over HTTPS in production. (Except localhost during development).
  sameSite: 'none', // sameSite: 'strict', to Prevents CSRF attacks
  maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration (7 days)
  path: '/', // Or a more specific path like '/api/auth/refresh-tokens'
};

/**
 * Checks if a string value is a valid member of a given enum.
 * @param enumObject
 * @param value The string to check.
 * @returns The enum member if valid, otherwise undefined.
 */
export function toEnum<T>(enumObject: object, value: string): T | undefined {
  if (Object.values(enumObject).includes(value)) {
    return value as T;
  }

  return undefined;
}

export function toAccountUser(user: User): AccountUser | null {
  if (!user) {
    return null;
  }

  const role = toEnum<Role>(Role, user.role);
  if (!role) {
    throw new Error('The user has an invalid role');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role,
    password: user.password,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
