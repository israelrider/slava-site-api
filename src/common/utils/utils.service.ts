import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import { AccountUser } from '@/users/interfaces/account-user.interface'
import { User } from '@/users/models/user.model'
import { Role } from '@/iam/enums/roles.enum'

@Injectable()
export class UtilsService {
  public generatePassword(): string {
    return crypto.randomUUID();
  }

  public generateRandomPassword(length: number = 12): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  public isRole(value: string): value is Role {
    const roleValues: Role[] = Object.values(Role);
    return roleValues.includes(value as Role);
  }

  /**
   * Checks if a string value is a valid member of a given enum.
   * @param enumObject
   * @param value The string to check.
   * @returns The enum member if valid, otherwise undefined.
   */
  public toEnum<T>(enumObject: object, value: string): T | undefined {
    if (Object.values(enumObject).includes(value)) {
      return value as T;
    }

    return undefined;
  }

  public toAccountUser(user: User): AccountUser | null {
    if (!user) {
      return null;
    }

    const role = this.toEnum<Role>(Role, user.role);
    if (!role) {
      throw new Error('The user has an invalid role');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isEmailConfirmed: user.isEmailConfirmed,
      role,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      rating: user.rating,
    };
  }
}
