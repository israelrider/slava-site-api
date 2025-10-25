import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { UpdateResult } from 'typeorm';

import { Auth } from '@/iam/decorators/auth.decorator';
import { AuthType } from '@/iam/enums/auth-type.enum';
import { Roles } from '@/iam/decorators/roles.decorator';
import { Role } from '@/iam/enums/roles.enum';
import { DiaryService } from '@/diary/diary.service';
import { CompatibilityDto } from '@/diary/dto/compatibility.dto'

@ApiTags('diary')
@ApiBearerAuth()
@Auth(AuthType.Bearer)
@Controller('diary')
export class DiaryController {
  constructor(private readonly diarySevice: DiaryService) {}

  @Get('user-diary')
  @Roles(Role.Customer)
  @ApiOperation({ summary: 'Get user diary' })
  @ApiResponse({ status: 200, description: 'Get user diary' })
  public async getUserDiary(@Req() request: FastifyRequest): Promise<object | null> {
    const userId: string = request.headers.id as string;
    return await this.diarySevice.findDiaryByUserId(+userId);
  }

  @Post('user-diary')
  @Roles(Role.Customer)
  @ApiOperation({ summary: 'Update user diary' })
  @ApiResponse({ status: 200, description: 'Update user diary' })
  public async updateUserDiary(@Req() request: FastifyRequest, @Body() data: CompatibilityDto): Promise<UpdateResult> {
    const userId: string = request.headers.id as string;
    return await this.diarySevice.updateDiaryByUserId(+userId, data);
  }
}
