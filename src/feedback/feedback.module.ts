import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FeedbackController } from '@/feedback/feedback.controller';
import { FeedbackService } from '@/feedback/feedback.service'
import { Feedback } from '@/feedback/models/feedback.model';
import { provideFeedbackRepository } from '@/feedback/repositories/feedback.repository.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback]),
  ],
  controllers: [FeedbackController],
  providers: [
    FeedbackService,
    ...provideFeedbackRepository(),
  ],
})
export class FeedbackModule {}
