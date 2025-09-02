import { UpdateResult } from 'typeorm';

import { Users } from '@/users/models/users.model';
import { AccountsUsers } from '@/users/interfaces/accounts-users.interface';
import { UserProfileDto } from '../dto/user-profile.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { UserDto } from '../dto/user.dto';

export interface UsersRepository {
  findAll(): Promise<Users[]>;
  findByEmail(email: string): Promise<Users | null>;
  findBySub(sub: number): Promise<Users>;
  findById(userId: string): Promise<Users | null>;
  create(userDto: UserDto): Promise<AccountsUsers>;
  updateByEmail(email: string): Promise<Users>;
  updateByPassword(email: string, password: string): Promise<Users>;
  updateUserProfile(id: string, userProfileDto: UserProfileDto): Promise<Users>;
  updateUser(id: string, userUpdateDto: UserUpdateDto): Promise<UpdateResult>;
  deleteUser(id: string): Promise<any>;
}

// @ts-ignore
export const USERS_REPOSITORY_TOKEN = 'users-repository-token';
