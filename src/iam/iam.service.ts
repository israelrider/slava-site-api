import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InsertResult, UpdateResult } from 'typeorm';

import { AccountUser } from '@/users/interfaces/account-user.interface';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/models/user.model';
import { HashingService } from '@/common/hashing/hashing.service';
import { MailerService } from '@/common/mailer/mailer.service';
import { UtilsService } from '@/common/utils/utils.service';
import { changePasswordEmail, forgotPasswordEmail, registrationEmail } from '@/common/mailer/mailer.constants';
import { AuthResponse } from '@/iam/interfaces/auth-response.interface';
import { JWTPayload } from '@/iam/interfaces/jwt-payload.interface';
import { jwtConfig } from '@/iam/config/jwt.config';
import { RegisterUserDto } from '@/iam/dto/register-user.dto';
import { LoginDto } from '@/iam/dto/login.dto';
import { ChangePasswordDto } from '@/iam/dto/change-password.dto';
import { ForgotPasswordDto } from '@/iam/dto/forgot-password.dto';
import { Role } from '@/iam/enums/roles.enum';

@Injectable()
export class IamService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
    private readonly mailerService: MailerService,
    private readonly utilsService: UtilsService,
  ) {}

  public async register(registerUserDto: RegisterUserDto): Promise<InsertResult> {
    try {
      registerUserDto.password = await this.hashingService.hash(registerUserDto.password);

      this.sendMailRegisterUser(registerUserDto)
        .catch((err: unknown) => Logger.error('Send mail failed but continuing registration', err));

      return await this.usersService.createUser(registerUserDto);
    } catch (err) {
      Logger.error(`User registration failed for email ${registerUserDto.email}`, err, 'IamService');
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async login(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      const user: AccountUser = await this.usersService.byEmailWithPassword(loginDto.email);
      if (!user) {
        throw new UnauthorizedException('User does not exists');
      }

      const passwordIsValid: boolean = await this.hashingService.compare(loginDto.password, user.password);
      if (!passwordIsValid) {
        throw new UnauthorizedException('Authentication failed. Wrong password');
      }

      return await this.generateTokens(user as User);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async refreshTokens(refreshToken: string | null): Promise<AuthResponse> {
    if (!refreshToken || !refreshToken.length) {
      throw new BadRequestException('The refreshToken had not been found.');
    }

    let result: AuthResponse = null;
    try {
      const { id } = await this.jwtService.verifyAsync<Pick<JWTPayload, 'id'>>(refreshToken);
      const user: AccountUser = await this.usersService.findBySub(id);
      result = await this.generateTokens(user as User);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(`Authentication token expired. ${error.message}`);
      }

      Logger.error('Error during token refresh', error);
      throw new UnauthorizedException('Error during token refresh');
    }

    if (!result || !result.refreshToken || !result.accessToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return result;
  }

  public async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<UpdateResult> {
    try {
      const password: string = this.utilsService.generatePassword();
      const loginDto: LoginDto = {
        email: forgotPasswordDto.email,
        password,
      };

      this.sendMailForgotPassword(loginDto).catch(
        (err: unknown) => Logger.error('Forgot Password: Send Mail Failed', err),
      );

      return await this.usersService.updatePassword(forgotPasswordDto.email, password);
    } catch (err) {
      Logger.error(`Creating new password failed for email ${forgotPasswordDto.email}`, err, 'IamService');
      throw new BadRequestException(err, 'Creating new password failed!');
    }
  }

  public async changePassword(id: number, changePasswordDto: ChangePasswordDto): Promise<UpdateResult> {
    let user: AccountUser = await this.usersService.findById(id);
    user = await this.usersService.byEmailWithPassword(user.email);
    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }

    const passwordIsValid: boolean = await this.hashingService.compare(changePasswordDto.oldPassword, user.password);
    if (!passwordIsValid) {
      Logger.warn(`Authentication failed. Wrong password for user with email ${user.email}.`, 'IamService');
      throw new UnauthorizedException('Authentication failed. Wrong password');
    }

    const loginDto: LoginDto = {
      email: user.email,
      password: changePasswordDto.password,
    };

    try {
      this.sendMailChangePassword(loginDto).catch(
        (err: unknown) => Logger.error('Change Password: Send Mail Failed!', err),
      );

      return await this.usersService.updatePassword(user.email, changePasswordDto.password);
    } catch (err) {
      Logger.error(`Change password failed for email ${user.email}`, err, 'IamService');
      throw new BadRequestException(err, 'Error: Change password failed!');
    }
  }

  private async generateTokens(user: User): Promise<AuthResponse> {
    const role = this.utilsService.toEnum<Role>(Role, user.role);
    if (!role) {
      Logger.warn(`The user with ID ${user.id} has an invalid role ${user.role}`, 'IamService');
      throw new UnauthorizedException('Invalid user role');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<JWTPayload>>(user.id, jwtConfig.accessTokenTtl ?? 3600, { role }),
      this.signToken(user.id, jwtConfig.refreshTokenTtl ?? 86400),
    ]);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        rating: user.rating,
      },
    };
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T): Promise<string> {
    return await this.jwtService.signAsync(
      {
        id: userId,
        ...payload,
      },
      {
        expiresIn,
      },
    );
  }

  private async sendMailRegisterUser(registerUserDto: RegisterUserDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: registerUserDto.email,
        from: 'from@example.com',
        subject: 'Registration successful ✔',
        html: registrationEmail(registerUserDto),
      });

      Logger.log(`Send email registration successfully to user email ${registerUserDto.email}`, 'IamService');
    } catch (err: unknown) {
      Logger.error(`Send Mail Failed for user email ${registerUserDto.email}`, err, 'IamService');
    }
  }

  private async sendMailForgotPassword(loginDto: LoginDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: loginDto.email,
        from: 'from@example.com',
        subject: 'Your new password ✔',
        text: `Here is your new password: ${loginDto.password}`,
        html: forgotPasswordEmail(loginDto.password),
      });
      Logger.log(`Forgot Password: Send Mail successfully to ${loginDto.email}`, 'IamService');
    } catch (err) {
      Logger.error(`Forgot Password: Send Mail Failed for ${loginDto.email}`, err, 'IamService');
    }
  }

  private async sendMailChangePassword(loginDto: LoginDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: loginDto.email,
        from: 'from@example.com',
        subject: 'Password Changed successfully ✔',
        text: `Here is your new password: ${loginDto.password}`,
        html: changePasswordEmail(loginDto.password),
      });
      Logger.log(`Change Password: Send Mail successfully to ${loginDto.email}`, 'IamService');
    } catch (err: unknown) {
      Logger.error(`Change Password: Send Mail Failed for ${loginDto.email}`, err, 'IamService');
    }
  }
}
