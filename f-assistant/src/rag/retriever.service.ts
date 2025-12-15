import { Injectable, Logger } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';
import { ConfigService } from '@nestjs/config';
import { Chunk } from './chunking.service.js';
import { SourceChunk } from '../storage/types.js';

@Injectable()
export class RetrieverService {
  private readonly logger = new Logger(RetrieverService.name);
  private readonly client: QdrantClient;
  private readonly collection: string;

  constructor(configService: ConfigService) {
    const url = configService.get<string>('QDRANT_URL');
    this.collection = configService.get<string>('QDRANT_COLLECTION') ?? 'foblex_flow';
    this.client = new QdrantClient({ url });
  }

  async upsertChunks(chunks: Chunk[]) {
    // store minimal payload; embeddings assumed precomputed upstream
    await this.client.upsert(this.collection, {
      points: chunks.map((chunk, idx) => ({
        id: `${chunk.id}-${idx}`,
        vector: [0],
        payload: chunk,
      })),
    });
  }

  async keywordSearch(query: string): Promise<SourceChunk[]> {
    try {
      const res = await this.client.scroll(this.collection, {
        with_payload: true,
        limit: 20,
      });
      const items = (res?.result ?? []) as any[];
      return items
        .map((item) => item.payload as any as SourceChunk)
        .filter((p) => p.content?.toLowerCase().includes(query.toLowerCase()));
    } catch (err) {
      this.logger.warn(`Falling back to empty search: ${err}`);
      return [];
    }
  }
}
