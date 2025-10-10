import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { Roles } from '@/iam/decorators/roles.decorator';
import { RolesGuard } from '@/iam/guards/roles/roles.guard';
import { Role } from '@/iam/enums/roles.enum';
import { AskFromService } from '@/ask-from/askFrom.service'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Auth } from '@/iam/decorators/auth.decorator'
import { AuthType } from '@/iam/enums/auth-type.enum'
import { CharacterDto } from '@/ask-from/dto/character.dto'
import { QuestionDto } from '@/ask-from/dto/question.dto'

@UseGuards(RolesGuard)
@Controller('ask-from')
export class AskFromController {
  constructor(private readonly askFromService: AskFromService) {}

  @Post('character-relevance')
  @ApiBearerAuth()
  @Auth(AuthType.Bearer)
  @Roles(Role.Customer)
  async characterRelevance(@Body() characterDto: CharacterDto): Promise<string> {
    return this.askFromService.checkCharacterRelevance(characterDto.character.trim());
  }

  @Post('question-to-character')
  @ApiBearerAuth()
  @Auth(AuthType.Bearer)
  @Roles(Role.Customer)
  async questionToCharacter(@Body() questionDto: QuestionDto): Promise<string> {
    return this.askFromService.askQuestionToCharacter(questionDto);
  }
}
