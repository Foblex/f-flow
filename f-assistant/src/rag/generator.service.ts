import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { AnswerPack, answerPackSchema } from './schemas.js';
import { PromptService } from './prompt.service.js';

@Injectable()
export class GeneratorService {
  private readonly logger = new Logger(GeneratorService.name);
  private readonly openai: OpenAI;

  constructor(private readonly promptService: PromptService, configService: ConfigService) {
    const apiKey = configService.get<string>('OPENAI_API_KEY');
    this.openai = new OpenAI({ apiKey });
  }

  async generate(packInput: { source: AnswerPack['source']; context: string[]; query: string }): Promise<AnswerPack> {
    const prompt = this.promptService.buildPrompt(packInput.source, packInput.context, packInput.query);
    try {
      const res = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-5.2',
        messages: [prompt],
        response_format: { type: 'json_object' },
      });
      const text = res.choices?.[0]?.message?.content ?? '';
      return answerPackSchema.parse(JSON.parse(text));
    } catch (err) {
      this.logger.warn(`OpenAI generation failed, falling back to template: ${err}`);
      const fallback: AnswerPack = {
        source: packInput.source,
        drafts: [
          {
            id: 'A',
            tone: 'short',
            description: 'Short engineering answer',
            text: 'Placeholder response. Please review.',
            citations: [],
          },
          {
            id: 'B',
            tone: 'technical',
            description: 'Detailed technical answer',
            text: 'Technical placeholder. Provide details after running RAG.',
            citations: [],
          },
          {
            id: 'C',
            tone: 'clarify',
            description: 'Ask for missing info / repro',
            text: 'Could you share reproduction steps, Angular version, and @foblex/flow version?',
            citations: [],
          },
        ],
        confidence: 0.1,
        missing_context: ['Angular version', '@foblex/flow version', 'minimal reproduction'],
      };
      return fallback;
    }
  }
}
