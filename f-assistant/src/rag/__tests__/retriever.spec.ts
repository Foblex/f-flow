import { RagService } from '../rag.service.js';
import { GeneratorService } from '../generator.service.js';
import { RetrieverService } from '../retriever.service.js';
import { AnswerPack } from '../schemas.js';

describe('Retriever smoke', () => {
  it('returns sources for fNodePosition', async () => {
    const retriever = { keywordSearch: jest.fn().mockResolvedValue([{ path: 'projects/flow.ts', lines: 'L1-L2', content: 'fNodePosition helper' }]) } as any as RetrieverService;
    const generator = {
      generate: jest.fn().mockResolvedValue({
        source: { type: 'website', repo: 'Foblex/f-flow', url: 'x' },
        drafts: [
          { id: 'A', tone: 'short', description: 'd', text: 't', citations: [] },
          { id: 'B', tone: 'technical', description: 'd', text: 't', citations: [] },
          { id: 'C', tone: 'clarify', description: 'd', text: 't', citations: [] },
        ],
        confidence: 0.2,
        missing_context: [],
      } as AnswerPack),
    } as any as GeneratorService;

    const svc = new RagService(retriever, generator);
    const pack = await svc.answer('fNodePosition');
    expect(retriever.keywordSearch).toHaveBeenCalledWith('fNodePosition');
    expect(pack.drafts.length).toBe(3);
  });
});
