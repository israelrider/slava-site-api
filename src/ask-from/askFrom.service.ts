import { Injectable } from '@nestjs/common';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { QuestionDto } from '@/ask-from/dto/question.dto'
import { CharacterDto } from '@/ask-from/dto/character.dto'

@Injectable()
export class AskFromService {
  public async checkCharacterRelevance(characterDto: CharacterDto): Promise<string> {
    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    const ai = new GoogleGenAI({});

    return await this.action(ai, characterDto.language, characterDto.character.trim());
  }

  private async action(ai: GoogleGenAI, language: string, character: string): Promise<string> {
    const contents: string = `I define four criteria for evaluating a character:
First. He is a physical character.
Second. He is a sentient individual.
Third. He is a character from the past, present, or future.
Fourth. He is a character, who can be imagined as potentially capable of engaging in meaningful human dialogue.
Question:
Does the ${character} meet all four criteria?
Please provide for the answer in a positive case only word "yes".
Otherwise please describe your decision.
Please answer in ${language} language.
`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        thinkingConfig: {
          // Disables thinking.
          thinkingBudget: 0,
        },
        // systemInstruction: "אתה פרויד",
      },
    });

    return response.text.trim();
  }

  public async askQuestionToCharacter(questionDto: QuestionDto): Promise<string> {
    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    const ai = new GoogleGenAI({});

    const language = questionDto.language;
    const character = questionDto.character.trim();
    const question = questionDto.question.trim();
    return await this.actionQuestion(ai, language, character, question);
  }

  private async actionQuestion(ai: GoogleGenAI, language: string, character: string, question: string): Promise<string> {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        thinkingConfig: {
          // Disables thinking.
          thinkingBudget: 0,
        },
        systemInstruction: `You are a character ${character}. Answer the question as if you are this character. Please answer in ${language} language.`,
      },
      contents: `Question: ${question}`,
    });

    return response.text.trim();
  }
}
