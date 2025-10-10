import { PickType } from '@nestjs/swagger';

import { QuestionDto } from '@/ask-from/dto/question.dto';

export class CharacterDto extends PickType(QuestionDto, [
  'character',
] as const) {}
