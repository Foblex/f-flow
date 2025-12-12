import { answerPackSchema } from '../schemas.js';

describe('answerPackSchema', () => {
  it('validates a correct answer pack', () => {
    const data = {
      source: { type: 'github_issue', repo: 'Foblex/f-flow', url: 'https://github.com/Foblex/f-flow/issues/1', number: 1 },
      drafts: [
        { id: 'A', tone: 'short', description: 'short', text: 'ok', citations: [] },
        { id: 'B', tone: 'technical', description: 'tech', text: 'ok', citations: [] },
        { id: 'C', tone: 'clarify', description: 'clarify', text: 'ok', citations: [] },
      ],
      confidence: 0.5,
      missing_context: ['version'],
    };
    const parsed = answerPackSchema.parse(data);
    expect(parsed.drafts).toHaveLength(3);
  });
});
