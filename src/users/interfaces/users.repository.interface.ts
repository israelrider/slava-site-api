import { InsertResult, UpdateResult } from 'typeorm';

import { AccountUser } from '@/users/interfaces/account-user.interface';
import { UserProfileDto } from 'src/users/dto/user-profile.dto';
import { UserUpdateDto } from 'src/users/dto/user-update.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from '@/users/models/user.model';

export interface UsersRepository {
  findAll(): Promise<User[]>;

  findByEmail(email: string): Promise<User | null>;

  byEmailWithPassword(email: string): Promise<User | null>;

  findBySub(sub: number): Promise<User>;

  findById(userId: number): Promise<User | null>;

  create(userDto: UserDto): Promise<InsertResult>;

  updatePassword(email: string, password: string): Promise<UpdateResult>;

  updateUserProfile(id: number, userProfileDto: UserProfileDto): Promise<UpdateResult>;

  updateUser(id: number, userUpdateDto: UserUpdateDto): Promise<UpdateResult>;

  deleteUser(user: AccountUser): Promise<User>;
}

// @ts-ignore
export const USERS_REPOSITORY_TOKEN = 'users-repository-token';
