import { Injectable, UnauthorizedException } from '@nestjs/common';
import crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SignatureService {
  constructor(private readonly configService: ConfigService) {}

  verifySignature(signature: string | undefined, rawBody: string) {
    const secret = this.configService.get<string>('GITHUB_WEBHOOK_SECRET');
    if (!secret) {
      return;
    }
    if (!signature) {
      throw new UnauthorizedException('Missing signature');
    }
    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(rawBody).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
      throw new UnauthorizedException('Invalid signature');
    }
  }
}
