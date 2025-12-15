import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { TelegramModule } from './telegram.module.js';
import { TelegramService } from './telegram.service.js';
import * as dotenv from 'dotenv';
import { ConfigModule } from '../../config/config.module.js';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(TelegramModule, {
    bufferLogs: true,
  });
  const service = app.get(TelegramService);
  service.launch();
}

bootstrap();
