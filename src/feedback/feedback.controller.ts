import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { UpdateResult } from 'typeorm';

import { FeedbackService } from '@/feedback/feedback.service';
import { FeedbackDto } from '@/feedback/dto/feedback.dto'
import { Feedback } from '@/feedback/models/feedback.model'

@ApiBearerAuth()
@ApiTags('feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackSevice: FeedbackService) {}

  @Get()
  @ApiOperation({ summary: 'Get all feedback.' })
  @ApiResponse({ status: 200, description: 'Feedback request successful.' })
  public async getAll(): Promise<Feedback[]> {
    return await this.feedbackSevice.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Add user feedback.' })
  @ApiResponse({ status: 200, description: 'User feedback added successfully.' })
  public async addFeedback(@Req() request: FastifyRequest, @Body() feedbackDto: FeedbackDto): Promise<UpdateResult> {
    const userId: string = request.headers.id as string;
    return await this.feedbackSevice.addFeedback(+userId, feedbackDto);
  }
}
