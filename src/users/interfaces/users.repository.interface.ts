import { InsertResult, UpdateResult } from 'typeorm';

import { AccountUser } from '@/users/interfaces/account-user.interface';
import { UpdateProfileDto } from '@/users/dto/update-profile.dto';
import { RegisterUserDto } from '@/iam/dto/register-user.dto';
import { User } from '@/users/models/user.model';

export interface UsersRepository {
  findAll(): Promise<User[]>;

  findByEmail(email: string): Promise<User | null>;

  byEmailWithPassword(email: string): Promise<User | null>;

  findBySub(sub: number): Promise<User>;

  findById(userId: number): Promise<User | null>;

  create(registerUserDto: RegisterUserDto): Promise<InsertResult>;

  updatePassword(email: string, password: string): Promise<UpdateResult>;

  updateUser<T>(id: number, userDto: T): Promise<UpdateResult>;

  deleteUser(user: AccountUser): Promise<User>;
}

// @ts-ignore
export const USERS_REPOSITORY_TOKEN = 'users-repository-token';
