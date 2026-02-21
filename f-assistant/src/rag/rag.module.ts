import { Module } from '@nestjs/common';
import { ChunkingService } from './chunking.service.js';
import { RetrieverService } from './retriever.service.js';
import { GeneratorService } from './generator.service.js';
import { PromptService } from './prompt.service.js';
import { RagService } from './rag.service.js';
import { RagController } from './rag.controller.js';
import { StorageModule } from '../storage/storage.module.js';
import { ConfigModule } from '../config/config.module.js';

@Module({
  imports: [StorageModule, ConfigModule],
  providers: [ChunkingService, RetrieverService, GeneratorService, PromptService, RagService],
  exports: [ChunkingService, RetrieverService, GeneratorService, PromptService, RagService],
  controllers: [RagController],
})
export class RagModule {}
export { RagService } from './rag.service.js';
