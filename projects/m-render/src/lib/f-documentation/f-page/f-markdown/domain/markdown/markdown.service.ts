import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import MarkdownIt from 'markdown-it';
import {
  EMarkdownContainerType,
  ParseAlerts,
  ParseCodeGroup,
  ParseCodeView,
  ParseExampleGroup, ParsePreviewGroup
} from './parse-markdown';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { catchError, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FDocumentationEnvironmentService } from '../../../../f-documentation-environment.service';

@Injectable()
export class MarkdownService {

  private markdown: MarkdownIt = new MarkdownIt({ html: true, linkify: true });

  constructor(
    private httpClient: HttpClient,
    private domSanitizer: DomSanitizer,
    private fEnvironment: FDocumentationEnvironmentService,
    private router: Router,
  ) {
    this.markdown
      .use((x) => new ParseCodeView().render(x))
      .use(...new ParseAlerts().render(EMarkdownContainerType.ALERT_TIP, this.markdown))
      .use(...new ParseAlerts().render(EMarkdownContainerType.ALERT_INFO, this.markdown))
      .use(...new ParseAlerts().render(EMarkdownContainerType.ALERT_WARNING, this.markdown))
      .use(...new ParseAlerts().render(EMarkdownContainerType.ALERT_DANGER, this.markdown))
      .use(...new ParseAlerts().render(EMarkdownContainerType.ALERT_DANGER, this.markdown))
      .use(...new ParseAlerts().render(EMarkdownContainerType.ALERT_SUCCESS, this.markdown))
      .use(...new ParseCodeGroup().render())
      .use(...new ParsePreviewGroup(this.fEnvironment.getNavigation()).render())
      .use(...new ParseExampleGroup().render());
  }

  public parse(src: string): Observable<SafeHtml> {
    return this.httpClient.get(src, { responseType: 'text' }).pipe(take(1), catchError(() => of(''))).pipe(
      switchMap((text) => of(this.markdown.render(text))),
      switchMap((x) => of(this.cleanupEmptyParagraphs(x))),
      switchMap((x) => of(this.cleanupWasteParagraphFromExampleView(x))),
      switchMap((x) => of(this.cleanupWasteParagraphFromPreviewGroup(x))),
      switchMap((x) => of(this.normalizeLinks(x))),
      switchMap((x) => of(this.domSanitizer.bypassSecurityTrustHtml(x))),
    );
  }

  private normalizeLinks(html: string): string {
    const currentPath = this.router.url;
    const prefix = currentPath.substring(0, currentPath.lastIndexOf('/'));

    return html.replace(/<a\s+href="([^"]*)"/g, (match, href) => {
      if (!this.isExternalLink(href)) {
        let newHref = href.substring(0);
        if (!href.startsWith('./')) {
          newHref = href.startsWith('/') ? `${ prefix }${ href }` : `${ prefix }/${ href }`;
        }
        return `<a href="${ newHref }"`;
      }
      return match;
    });
  }

  private isExternalLink(href: string): boolean {
    return href.startsWith('www') || href.startsWith('http');
  }

  private cleanupEmptyParagraphs(html: string): string {
    return html.replace(/<p>\s*<\/p>/g, '');
  }

  private cleanupWasteParagraphFromExampleView(html: string): string {
    return html.replace(/<div class="f-code-group-body">\s*<p>[^<]*<\/p>/g, '<div class="f-code-group-body">');
  }

  private cleanupWasteParagraphFromPreviewGroup(html: string): string {
    return html.replace(/<p>(\[[^\]]+\](\s*\[[^\]]+\])*)<\/p>/g, '');
  }
}

