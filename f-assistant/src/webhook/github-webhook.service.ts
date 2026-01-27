import { Injectable, Logger } from '@nestjs/common';
import { RagService } from '../rag/rag.module.js';
import { GithubDiscussionsService } from '../integrations/github/github-discussions.service.js';
import { TelegramService } from '../integrations/telegram/telegram.service.js';
import { DraftsService } from '../storage/drafts.service.js';

@Injectable()
export class GithubWebhookService {
  private readonly logger = new Logger(GithubWebhookService.name);

  constructor(
    private readonly ragService: RagService,
    private readonly discussionsService: GithubDiscussionsService,
    private readonly telegramService: TelegramService,
    private readonly draftsService: DraftsService,
  ) {}

  async handleEvent(payload: any) {
    const { action, issue, discussion } = payload;
    if (!action) return;
    if (issue && ['opened'].includes(action)) {
      await this.createDraftFromIssue(issue.html_url);
    }
    if (discussion && ['created'].includes(action)) {
      await this.createDraftFromDiscussion(discussion.html_url);
    }
  }

  private async createDraftFromIssue(url: string) {
    const pack = await this.ragService.answerFromUrl(url);
    await this.telegramService.sendDraftPack(pack);
    await this.draftsService.savePack(pack);
    this.logger.log(`Draft pack created for issue ${url}`);
  }

  private async createDraftFromDiscussion(url: string) {
    const pack = await this.ragService.answerFromUrl(url);
    await this.telegramService.sendDraftPack(pack);
    await this.draftsService.savePack(pack);
    this.logger.log(`Draft pack created for discussion ${url}`);
  }
}
