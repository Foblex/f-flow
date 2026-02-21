import { Module } from '@nestjs/common';
import { GithubWebhookController } from './github-webhook.controller.js';
import { GithubWebhookService } from './github-webhook.service.js';
import { SignatureService } from './signature.service.js';
import { RagModule } from '../rag/rag.module.js';
import { IntegrationsGithubModule } from '../integrations/github/github.module.js';
import { TelegramModule } from '../integrations/telegram/telegram.module.js';

@Module({
  imports: [RagModule, IntegrationsGithubModule, TelegramModule],
  controllers: [GithubWebhookController],
  providers: [GithubWebhookService, SignatureService],
})
export class WebhookModule {}
