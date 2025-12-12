import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';
import { GithubWebhookService } from './github-webhook.service.js';
import { SignatureService } from './signature.service.js';

@Controller('/webhook/github')
export class GithubWebhookController {
  constructor(
    private readonly webhookService: GithubWebhookService,
    private readonly signatureService: SignatureService,
  ) {}

  @Post()
  @HttpCode(200)
  async handle(@Body() payload: any, @Headers('x-hub-signature-256') signature?: string) {
    this.signatureService.verifySignature(signature, JSON.stringify(payload));
    await this.webhookService.handleEvent(payload);
    return { ok: true };
  }
}
