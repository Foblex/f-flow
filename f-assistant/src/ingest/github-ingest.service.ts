import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GithubIngestService {
  private readonly logger = new Logger(GithubIngestService.name);

  async ingestIssues(since?: string) {
    this.logger.log(`Stub ingest GitHub issues since ${since ?? 'beginning'}`);
  }
}
