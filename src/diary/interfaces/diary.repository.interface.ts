import { Diary } from '@/diary/models/diary.model';
import { DiaryDataDto } from '@/diary/dto/diary-data.dto';
import { UpdateResult } from 'typeorm';

export interface DiaryRepository {
  findDiaryByUserId(userId: number): Promise<Diary>;

  updateDiaryByUserId(userId: number, diaryData: DiaryDataDto): Promise<UpdateResult>;
}

// @ts-ignore
export const DIARY_REPOSITORY_TOKEN = 'diary-repository-token';
