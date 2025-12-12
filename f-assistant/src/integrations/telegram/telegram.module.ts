import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service.js';
import { TelegramUiService } from './telegram-ui.service.js';
import { RagModule } from '../../rag/rag.module.js';
import { IntegrationsGithubModule } from '../github/github.module.js';
import { StorageModule } from '../../storage/storage.module.js';

@Module({
  imports: [RagModule, IntegrationsGithubModule, StorageModule],
  providers: [TelegramService, TelegramUiService],
  exports: [TelegramService],
})
export class TelegramModule {}
