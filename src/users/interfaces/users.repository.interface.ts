import { UpdateResult } from 'typeorm';

import { AccountUser } from '@/users/interfaces/account-user.interface';
import { UserProfileDto } from 'src/users/dto/user-profile.dto';
import { UserUpdateDto } from 'src/users/dto/user-update.dto';
import { UserDto } from 'src/users/dto/user.dto';

export interface UsersRepository {
  findAll(): Promise<AccountUser[]>;

  findByEmail(email: string): Promise<AccountUser | null>;

  byEmailWithPassword(email: string): Promise<AccountUser | null>;

  findBySub(sub: number): Promise<AccountUser>;

  findById(userId: string): Promise<AccountUser | null>;

  create(userDto: UserDto): Promise<AccountUser>;

  updateByEmail(email: string): Promise<AccountUser>;

  updateByPassword(email: string, password: string): Promise<AccountUser>;

  updateUserProfile(id: string, userProfileDto: UserProfileDto): Promise<AccountUser>;

  updateUser(id: string, userUpdateDto: UserUpdateDto): Promise<UpdateResult>;

  deleteUser(user: AccountUser): Promise<AccountUser>;
}

// @ts-ignore
export const USERS_REPOSITORY_TOKEN = 'users-repository-token';
