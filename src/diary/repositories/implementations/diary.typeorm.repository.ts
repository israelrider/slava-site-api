import { Repository, UpdateResult } from 'typeorm';

import { Diary } from '@/diary/models/diary.model';
import { DiaryRepository } from '@/diary/interfaces/diary.repository.interface';
import { DiaryDataDto } from '@/diary/dto/diary-data.dto';

export class DiaryTypeOrmRepository implements DiaryRepository {
  constructor(private readonly diaryRepository: Repository<Diary>) {}

  public async findDiaryByUserId(userId: number): Promise<Diary | null> {
    return await this.diaryRepository.findOne(
      {
        where: {
          user: {
            id: userId,
          },
        },
      },
    );
  }

  public async updateDiaryByUserId(userId: number, diaryData: DiaryDataDto): Promise<UpdateResult> {
    const updateResult: UpdateResult = await this.diaryRepository.update(
      {
        user: {
          id: userId,
        },
      },
      {
        data: diaryData,
      },
    );

    if (updateResult.affected === 0) {
      const newDiary: Diary = this.diaryRepository.create({
        user: {
          id: userId,
        },
        data: diaryData,
      });
      await this.diaryRepository.save(newDiary);
    }

    return updateResult;
  }
}
