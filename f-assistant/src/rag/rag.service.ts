import { Injectable } from '@nestjs/common';
import { RetrieverService } from './retriever.service.js';
import { GeneratorService } from './generator.service.js';
import { answerPackSchema, AnswerPack } from './schemas.js';

@Injectable()
export class RagService {
  constructor(private readonly retriever: RetrieverService, private readonly generator: GeneratorService) {}

  async answer(query: string): Promise<AnswerPack> {
    const context = await this.retrieve(query);
    const pack = await this.generator.generate({
      source: {
        type: 'website',
        repo: 'Foblex/f-flow',
        url: 'https://foblex.dev/questions',
      },
      context,
      query,
    });
    return answerPackSchema.parse(pack);
  }

  async answerFromUrl(url: string): Promise<AnswerPack> {
    const context = await this.retrieve(url);
    const pack = await this.generator.generate({
      source: {
        type: url.includes('/discussions/') ? 'github_discussion' : 'github_issue',
        repo: 'Foblex/f-flow',
        url,
      },
      context,
      query: url,
    });
    return answerPackSchema.parse(pack);
  }

  private async retrieve(query: string): Promise<string[]> {
    const results = await this.retriever.keywordSearch(query);
    return results.map((r) => `${r.path} ${r.lines ?? ''}: ${r.content.slice(0, 400)}`);
  }
}
