import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DiaryController } from '@/diary/diary.controller';
import { DiaryService } from '@/diary/diary.service'
import { Diary } from '@/diary/models/diary.model';
import { provideDiaryRepository } from '@/diary/repositories/diary.repository.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary]),
  ],
  controllers: [DiaryController],
  providers: [
    DiaryService,
    ...provideDiaryRepository(),
  ],
})
export class DiaryModule {}
