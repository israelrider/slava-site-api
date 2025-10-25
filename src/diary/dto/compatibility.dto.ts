import { IsObject } from 'class-validator';

import { DiaryDataDto } from '@/diary/dto/diary-data.dto';

export class CompatibilityDto {
  @IsObject()
  compatibilityKey: DiaryDataDto;
}
