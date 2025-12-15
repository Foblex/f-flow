import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class JobsService {
  private readonly prisma = new PrismaClient();

  async enqueue(sourceUrl: string, payload: any) {
    return this.prisma.job.create({ data: { status: 'queued', sourceUrl, payload: JSON.stringify(payload) } });
  }
}
