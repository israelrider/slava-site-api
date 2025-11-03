import { InsertResult, Repository } from 'typeorm';

import { Feedback } from '@/feedback/models/feedback.model';
import { FeedbackRepository } from '@/feedback/interfaces/feedback.repository.interface';
import { FeedbackDto } from '@/feedback/dto/feedback.dto';
import { User } from '@/users/models/user.model';

export class FeedbackTypeOrmRepository implements FeedbackRepository {
  constructor(private readonly feedbackRepository: Repository<Feedback>) {}

  async findAllWithUser(): Promise<Feedback[]> {
    return this.feedbackRepository.find(
      {
        select: {
          comment: true,
          createdAt: true,
          user: {
            name: true,
          },
        },
        // Specify the name of the many-to-one relation field.
        relations: [
          'user',
        ],
        order: {
          createdAt: 'DESC',
        },
      },
    );
  }

  public async create(userId: number, feedbackDto: FeedbackDto): Promise<InsertResult> {
    return await this.feedbackRepository.insert({
      user: { id: userId } as User,
      comment: feedbackDto.comment,
    });
  }
}
