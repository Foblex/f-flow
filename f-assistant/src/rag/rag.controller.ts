import { Body, Controller, Post } from '@nestjs/common';
import { RagService } from './rag.service.js';
import { AnswerPack } from './schemas.js';

@Controller('answer')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post()
  async answer(@Body('query') query: string): Promise<AnswerPack> {
    return this.ragService.answer(query);
  }
}
