import { Inject, Injectable, Optional } from '@angular/core';
import {
  GetVersionHandler,
  GetVersionRequest,
  IDocsComponent,
  IDocsFooterNavigation, IDocsHeaderNavigationItem,
  IDocsSocialLink, IDocsTableOfContent, IEnvironmentService
} from '../domain';
import { F_DOCS_ENVIRONMENT, IDocsEnvironment, INavigationGroup } from './index';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FDocumentationEnvironmentService implements IEnvironmentService {

  constructor(
    @Optional() @Inject(F_DOCS_ENVIRONMENT) private environment: IDocsEnvironment,
    private http: HttpClient
  ) {
  }

  public getMarkdownUrl(markdown: string): string {
    if (!markdown || !this.isMarkdownExist(markdown)) {
      return this.environment.notFoundMD;
    }
    let url = this.environment.docsDir + markdown;

    url = url.replace(/(\/en\/guides)+/g, '/en/guides');
    url = url.replace(/(\/en\/examples)+/g, '/en/examples');

    if (!url.endsWith('.md')) {
      url += '.md';
    }
    return url;
  }

  private isMarkdownExist(id: string): boolean {
    return !!this.environment.navigation.find((x) => x.items.some((i) => i.link === id));
  }

  public getLogo(): string {
    return this.environment.logo;
  }

  public getTitle(): string {
    return this.environment.title;
  }

  public getHeaderNavigation(): IDocsHeaderNavigationItem[] {
    return this.environment.headerNavigation || [];
  }

  public getVersion(): Observable<string | undefined> {
    return new GetVersionHandler(this.http).handle(
      new GetVersionRequest(this.environment.version)
    );
  }

  public getComponents(): IDocsComponent[] {
    return this.environment.components || [];
  }

  public getNavigation(): INavigationGroup[] {
    return this.environment.navigation;
  }

  public getFooterNavigation(): IDocsFooterNavigation {
    return this.environment.footerNavigation || {};
  }

  public getSocialLinks(): IDocsSocialLink[] {
    return this.environment.socialLinks || [];
  }

  public getToC(): IDocsTableOfContent {
    return this.environment.toC || {
      title: 'In this article',
      range: { start: 2, end: 6 },
    };
  }
}
