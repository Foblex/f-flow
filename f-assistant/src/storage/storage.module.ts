import { Module } from '@nestjs/common';
import { DraftsService } from './drafts.service.js';
import { JobsService } from './jobs.service.js';

@Module({
  providers: [DraftsService, JobsService],
  exports: [DraftsService, JobsService],
})
export class StorageModule {}
