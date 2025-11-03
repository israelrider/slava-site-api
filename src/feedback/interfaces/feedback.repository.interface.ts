import { Feedback } from '@/feedback/models/feedback.model';
import { FeedbackDto } from '@/feedback/dto/feedback.dto';
import { InsertResult } from 'typeorm';

export interface FeedbackRepository {
  findAllWithUser(): Promise<Feedback[]>;

  create(userId: number, feedbackDto: FeedbackDto): Promise<InsertResult>;
}

// @ts-ignore
export const FEEDBACK_REPOSITORY_TOKEN = 'feedback-repository-token';
