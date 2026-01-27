import { Module } from '@nestjs/common';
import { GithubAuthService } from './github-auth.service.js';
import { GithubClientService } from './github-client.service.js';
import { GithubDiscussionsService } from './github-discussions.service.js';

@Module({
  providers: [GithubAuthService, GithubClientService, GithubDiscussionsService],
  exports: [GithubAuthService, GithubClientService, GithubDiscussionsService],
})
export class IntegrationsGithubModule {}
