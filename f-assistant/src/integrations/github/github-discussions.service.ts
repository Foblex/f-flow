import { Injectable, Logger } from '@nestjs/common';
import { GithubClientService } from './github-client.service.js';

@Injectable()
export class GithubDiscussionsService {
  private readonly logger = new Logger(GithubDiscussionsService.name);

  constructor(private readonly github: GithubClientService) {}

  async fetchIssue(url: string) {
    const [owner, repo, , , numberStr] = url.split('/').slice(-5);
    const number = Number(numberStr);
    const rest = this.github.getRest();
    const { data } = await rest.issues.get({ owner, repo, issue_number: number });
    return data;
  }

  async commentIssue(url: string, body: string) {
    const [owner, repo, , , numberStr] = url.split('/').slice(-5);
    const number = Number(numberStr);
    const rest = this.github.getRest();
    await rest.issues.createComment({ owner, repo, issue_number: number, body });
    this.logger.log(`Posted comment to ${url}`);
  }
}
