import { GeneratorService } from '../generator.service.js';
import { PromptService } from '../prompt.service.js';
import { answerPackSchema } from '../schemas.js';

describe('GeneratorService', () => {
  it('returns valid JSON when OpenAI is mocked', async () => {
    const prompt = new PromptService();
    const config = { get: () => 'token' } as any;
    const generator = new GeneratorService(prompt, config);
    (generator as any).openai = {
      chat: {
        completions: {
          create: async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    source: { type: 'website', repo: 'Foblex/f-flow', url: 'x' },
                    drafts: [
                      { id: 'A', tone: 'short', description: 'd', text: 't', citations: [] },
                      { id: 'B', tone: 'technical', description: 'd', text: 't', citations: [] },
                      { id: 'C', tone: 'clarify', description: 'd', text: 't', citations: [] },
                    ],
                    confidence: 0.3,
                    missing_context: [],
                  }),
                },
              },
            ],
          }),
        },
      },
    };

    const pack = await generator.generate({
      source: { type: 'website', repo: 'Foblex/f-flow', url: 'x' },
      context: ['ctx'],
      query: 'hello',
    });
    expect(answerPackSchema.parse(pack).drafts.length).toBe(3);
  });
});
