import { Inject, Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { DIARY_REPOSITORY_TOKEN } from '@/diary/interfaces/diary.repository.interface';
import { DiaryTypeOrmRepository } from '@/diary/repositories/implementations/diary.typeorm.repository';
import { Diary } from '@/diary/models/diary.model';
import { CompatibilityDto } from '@/diary/dto/compatibility.dto'
import { DiaryDataDto } from '@/diary/dto/diary-data.dto'

@Injectable()
export class DiaryService {
  constructor(
    @Inject(DIARY_REPOSITORY_TOKEN)
    private readonly diaryRepository: DiaryTypeOrmRepository,
  ) {}

  public async findDiaryByUserId(userId: number): Promise<object | null> {
    const diary: Diary | null = await this.diaryRepository.findDiaryByUserId(userId);
    return diary?.data;
  }

  public async updateDiaryByUserId(userId: number, data: CompatibilityDto): Promise<UpdateResult> {
    const diaryData: DiaryDataDto = data.compatibilityKey;
    return await this.diaryRepository.updateDiaryByUserId(userId, diaryData);
  }
}
