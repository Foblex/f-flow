import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module.js';
import { WebhookModule } from './webhook/webhook.module.js';
import { RagModule } from './rag/rag.module.js';
import { IngestModule } from './ingest/ingest.module.js';
import { IntegrationsGithubModule } from './integrations/github/github.module.js';
import { TelegramModule } from './integrations/telegram/telegram.module.js';
import { StorageModule } from './storage/storage.module.js';

@Module({
  imports: [
    ConfigModule,
    StorageModule,
    RagModule,
    IngestModule,
    IntegrationsGithubModule,
    TelegramModule,
    WebhookModule,
  ],
})
export class AppModule {}
