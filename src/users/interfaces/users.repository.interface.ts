import { InsertResult, UpdateResult } from 'typeorm';

import { AccountUser } from '@/users/interfaces/account-user.interface';
import { RegisterUserDto } from '@/iam/dto/register-user.dto';
import { User } from '@/users/models/user.model';

export interface UsersRepository {
  findAll(): Promise<User[]>;

  byEmailWithPassword(email: string): Promise<User | null>;

  findById(userId: number): Promise<User | null>;

  create(registerUserDto: RegisterUserDto): Promise<InsertResult>;

  updatePassword(email: string, password: string): Promise<UpdateResult>;

  updateUser<T>(id: number, userDto: T): Promise<UpdateResult>;

  deleteUser(user: AccountUser): Promise<User>;
}

// @ts-ignore
export const USERS_REPOSITORY_TOKEN = 'users-repository-token';
