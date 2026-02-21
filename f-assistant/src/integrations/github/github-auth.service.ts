import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubAuthService {
  constructor(private readonly configService: ConfigService) {}

  getAuthToken(): string {
    const allowPat = this.configService.get<string>('ALLOW_PAT') === 'true';
    const pat = this.configService.get<string>('GITHUB_PAT');
    if (allowPat && pat) {
      return pat;
    }
    // For MVP fall back to PAT if provided, otherwise empty.
    return pat ?? '';
  }
}
