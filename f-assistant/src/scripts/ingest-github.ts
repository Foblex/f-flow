import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { IngestModule } from '../ingest/ingest.module.js';
import { GithubIngestService } from '../ingest/github-ingest.service.js';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const argv = await yargs(hideBin(process.argv)).option('since', { type: 'string' }).parse();
  const app = await NestFactory.createApplicationContext(IngestModule);
  const service = app.get(GithubIngestService);
  await service.ingestIssues(argv.since as string | undefined);
  await app.close();
}

bootstrap();
