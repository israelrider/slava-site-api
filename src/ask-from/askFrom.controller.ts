import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AskFromService } from '@/ask-from/askFrom.service';
import { CharacterDto } from '@/ask-from/dto/character.dto';
import { QuestionDto } from '@/ask-from/dto/question.dto';

@ApiBearerAuth()
@ApiTags('ask-from')
@Controller('ask-from')
export class AskFromController {
  constructor(private readonly askFromService: AskFromService) {}

  @Post('character-relevance')
  @ApiOperation({ summary: 'Check character relevance' })
  @ApiResponse({ status: 200, description: 'Character relevance result' })
  async characterRelevance(@Body() characterDto: CharacterDto): Promise<string> {
    return this.askFromService.checkCharacterRelevance(characterDto);
  }

  @Post('question-to-character')
  @ApiOperation({ summary: 'Ask question to character' })
  @ApiResponse({ status: 200, description: 'Answer from character' })
  async questionToCharacter(@Body() questionDto: QuestionDto): Promise<string> {
    return this.askFromService.askQuestionToCharacter(questionDto);
  }
}
