import { HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InsertResult, UpdateResult } from 'typeorm';

import { registrationEmail } from '@/common/mailer/mailer.constants'
import { HashingService } from '@/common/hashing/hashing.service';
import { MailerService } from '@/common/mailer/mailer.service';
import { UtilsService } from '@/common/utils/utils.service';
import { AccountUser } from '@/users/interfaces/account-user.interface';
import { USERS_REPOSITORY_TOKEN } from '@/users/interfaces/users.repository.interface';
import { UserDto } from '@/users/dto/user.dto';
import { UserProfileDto } from '@/users/dto/user-profile.dto';
import { UserUpdateDto } from '@/users/dto/user-update.dto';
import { UsersTypeOrmRepository } from '@/users/repositories/implementations/users.typeorm.repository';
import { User } from '@/users/models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersTypeOrmRepository,
    private readonly hashingService: HashingService,
    private readonly mailerService: MailerService,
    private readonly utilsService: UtilsService,
  ) {}

  public async findAll(): Promise<AccountUser[]> {
    const users: User[] = await this.usersRepository.findAll();
    return users.map((user: User) => this.utilsService.toAccountUser(user));
  }

  public async byEmailWithPassword(email: string): Promise<AccountUser> {
    const user: User | null = await this.usersRepository.byEmailWithPassword(email);
    return this.utilsService.toAccountUser(user);
  }

  public async findBySub(sub: number): Promise<AccountUser> {
    const user: User = await this.usersRepository.findBySub(sub);
    return this.utilsService.toAccountUser(user);
  }

  public async findById(userId: number): Promise<AccountUser> {
    const user: User | null = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return this.utilsService.toAccountUser(user);
  }

  public async updatePassword(email: string, password: string): Promise<UpdateResult> {
    try {
      return await this.usersRepository.updatePassword(email, password);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateUserProfile(id: number, userProfileDto: UserProfileDto): Promise<UpdateResult> {
    try {
      return await this.usersRepository.updateUserProfile(id, userProfileDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateUser(id: number, userUpdateDto: UserUpdateDto): Promise<UpdateResult> {
    try {
      return await this.usersRepository.updateUser(id, userUpdateDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async register(userDto: UserDto): Promise<InsertResult> {
    try {
      userDto.password = await this.hashingService.hash(userDto.password);

      this.sendMailRegisterUser(userDto)
        .catch((err: unknown) => Logger.error('Send mail failed but continuing registration', err));

      return await this.usersRepository.create(userDto);
    } catch (err) {
      Logger.error('User registration failed!', err);
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async deleteUser(id: number): Promise<AccountUser> {
    const accountUser: AccountUser = await this.findById(id);
    const user: User = await this.usersRepository.deleteUser(accountUser);
    return this.utilsService.toAccountUser(user);
  }

  private async sendMailRegisterUser(user: UserDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'from@example.com',
        subject: 'Registration successful ✔',
        html: registrationEmail(user),
      });

      Logger.log('User Registration: Send Mail successfully!', 'MailService');
    } catch (err: unknown) {
      Logger.error('User Registration: Send Mail failed!', err);
    }
  }
}
