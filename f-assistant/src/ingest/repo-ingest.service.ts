import { Injectable, Logger } from '@nestjs/common';
import { ChunkingService } from '../rag/chunking.service.js';
import { RetrieverService } from '../rag/retriever.service.js';

@Injectable()
export class RepoIngestService {
  private readonly logger = new Logger(RepoIngestService.name);

  constructor(private readonly chunker: ChunkingService, private readonly retriever: RetrieverService) {}

  async ingest(root = '..') {
    const chunks = await this.chunker.chunkRepo(root);
    await this.retriever.upsertChunks(chunks);
    this.logger.log(`Ingested ${chunks.length} chunks from ${root}`);
  }
}
