import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AnswerPack } from '../rag/schemas.js';

@Injectable()
export class DraftsService {
  private readonly prisma = new PrismaClient();

  async savePack(pack: AnswerPack) {
    await Promise.all(
      pack.drafts.map((draft) =>
        this.prisma.draft.create({
          data: {
            sourceType: pack.source.type,
            sourceUrl: pack.source.url,
            sourceNumber: pack.source.number ?? 0,
            author: pack.source.author ?? 'unknown',
            title: pack.source.title ?? '',
            draftId: draft.id,
            tone: draft.tone,
            text: draft.text,
            citations: JSON.stringify(draft.citations),
          },
        }),
      ),
    );
  }
}
