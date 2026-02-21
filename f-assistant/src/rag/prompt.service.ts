import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import { AnswerPack } from './schemas.js';

@Injectable()
export class PromptService {
  buildPrompt(source: AnswerPack['source'], context: string[], query: string) {
    const knowledgePath = path.resolve('KNOWLEDGE.md');
    const specPath = path.resolve('SPEC.md');
    const knowledge = fs.existsSync(knowledgePath) ? fs.readFileSync(knowledgePath, 'utf-8') : '';
    const spec = fs.existsSync(specPath) ? fs.readFileSync(specPath, 'utf-8') : '';

    const content = [
      'You are a human-in-the-loop GitHub assistant. Generate exactly three drafts in JSON.',
      knowledge,
      spec,
      'SOURCES:',
      context.map((c, idx) => `[#${idx}] ${c}`).join('\n'),
      'QUERY:',
      query,
    ].join('\n\n');

    return {
      role: 'system' as const,
      content,
    };
  }
}
