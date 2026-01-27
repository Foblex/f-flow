import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { graphql } from '@octokit/graphql';
import { GithubAuthService } from './github-auth.service.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubClientService {
  private readonly octokit: Octokit;
  private readonly graphqlClient: typeof graphql;
  private readonly repo: string;

  constructor(auth: GithubAuthService, config: ConfigService) {
    const token = auth.getAuthToken();
    this.repo = config.get<string>('GITHUB_REPO') ?? 'Foblex/f-flow';
    this.octokit = new Octokit({ auth: token });
    this.graphqlClient = graphql.defaults({ headers: { authorization: `token ${token}` } });
  }

  getRest() {
    return this.octokit;
  }

  getGraphql() {
    return this.graphqlClient;
  }

  getRepo() {
    return this.repo;
  }
}
