import { UpdateResult } from 'typeorm';

import { User } from '@/users/models/user.model';
import { AccountsUsers } from '@/users/interfaces/accounts-users.interface';
import { UserProfileDto } from '../dto/user-profile.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { UserDto } from '../dto/user.dto';

export interface UsersRepository {
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  findBySub(sub: number): Promise<User>;
  findById(userId: string): Promise<User | null>;
  create(userDto: UserDto): Promise<AccountsUsers>;
  updateByEmail(email: string): Promise<User>;
  updateByPassword(email: string, password: string): Promise<User>;
  updateUserProfile(id: string, userProfileDto: UserProfileDto): Promise<User>;
  updateUser(id: string, userUpdateDto: UserUpdateDto): Promise<UpdateResult>;
  deleteUser(id: string): Promise<any>;
}

// @ts-ignore
export const USERS_REPOSITORY_TOKEN = 'users-repository-token';
