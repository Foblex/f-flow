import { Module } from '@nestjs/common';
import { RepoIngestService } from './repo-ingest.service.js';
import { GithubIngestService } from './github-ingest.service.js';
import { RagModule } from '../rag/rag.module.js';

@Module({
  imports: [RagModule],
  providers: [RepoIngestService, GithubIngestService],
  exports: [RepoIngestService, GithubIngestService],
})
export class IngestModule {}
