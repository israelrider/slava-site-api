import { Inject, Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { FEEDBACK_REPOSITORY_TOKEN } from '@/feedback/interfaces/feedback.repository.interface';
import { FeedbackTypeOrmRepository } from '@/feedback/repositories/implementations/feedback.typeorm.repository';
import { FeedbackDto } from '@/feedback/dto/feedback.dto';
import { Feedback } from '@/feedback/models/feedback.model'

@Injectable()
export class FeedbackService {
  constructor(
    @Inject(FEEDBACK_REPOSITORY_TOKEN)
    private readonly feedbackRepository: FeedbackTypeOrmRepository,
  ) {}

  public async getAll(): Promise<Feedback[]> {
    return await this.feedbackRepository.findAllWithUser();
  }

  public async addFeedback(userId: number, feedbackDto: FeedbackDto): Promise<UpdateResult> {
    return await this.feedbackRepository.create(userId, feedbackDto);
  }
}
