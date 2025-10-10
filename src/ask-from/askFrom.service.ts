import { Injectable } from '@nestjs/common';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { QuestionDto } from '@/ask-from/dto/question.dto'

@Injectable()
export class AskFromService {
  public async checkCharacterRelevance(character: string): Promise<string> {
    // The client gets the API key from the environment variable `GEMINI_API_KEY`.
    const ai = new GoogleGenAI({});

    return await this.action(ai, character);
  }

  private async action(ai: GoogleGenAI, character: string): Promise<string> {
    const contents: string = `I define four criteria for evaluating a character:
First. He is a physical character.
Second. He is a sentient individual.
Third. He is a character from the past, present, or future.
Fourth. He is a character, who can be imagined as potentially capable of engaging in meaningful human dialogue.
Question:
Does the ${character} meet all four criteria?
Please provide for the answer in a positive case only word "yes".
Otherwise please describe your decision.
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

    const character = questionDto.character.trim();
    const question = questionDto.question.trim();
    return await this.actionQuestion(ai, character, question);
  }

  private async actionQuestion(ai: GoogleGenAI, character: string, question: string): Promise<string> {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        thinkingConfig: {
          // Disables thinking.
          thinkingBudget: 0,
        },
        systemInstruction: `You are a character ${character}. Answer the question as if you are this character.`,
      },
      contents: `Question: ${question}`,
    });

    return response.text.trim();
  }
}
