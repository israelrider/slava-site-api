import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class QuestionDto  {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(25)
  readonly character: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(512)
  readonly question: string;
}
