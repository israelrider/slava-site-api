import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { UpdateResult } from 'typeorm';

import { DiaryService } from '@/diary/diary.service';
import { CompatibilityDto } from '@/diary/dto/compatibility.dto'

@ApiBearerAuth()
@ApiTags('diary')
@Controller('diary')
export class DiaryController {
  constructor(private readonly diarySevice: DiaryService) {}

  @Get('user-diary')
  @ApiOperation({ summary: 'Get user diary' })
  @ApiResponse({ status: 200, description: 'User diary data' })
  public async getUserDiary(@Req() request: FastifyRequest): Promise<object | null> {
    const userId: string = request.headers.id as string;
    return await this.diarySevice.findDiaryByUserId(+userId);
  }

  @Post('user-diary')
  @ApiOperation({ summary: 'Update user diary' })
  @ApiResponse({ status: 200, description: 'User diary updated' })
  public async updateUserDiary(@Req() request: FastifyRequest, @Body() data: CompatibilityDto): Promise<UpdateResult> {
    const userId: string = request.headers.id as string;
    return await this.diarySevice.updateDiaryByUserId(+userId, data);
  }
}
