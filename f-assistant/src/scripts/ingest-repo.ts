import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { IngestModule } from '../ingest/ingest.module.js';
import { RepoIngestService } from '../ingest/repo-ingest.service.js';
import { ConfigModule } from '../config/config.module.js';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(IngestModule, { imports: [ConfigModule] });
  const service = app.get(RepoIngestService);
  await service.ingest('..');
  await app.close();
}

bootstrap();
