import { inject, Injectable, signal } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import MarkdownIt from 'markdown-it';

import {
  DEFAULT_MARKDOWN_PAGE_LAYOUT_OPTIONS,
  EMarkdownContainerType,
  IMarkdownFrontMatterData,
  IMarkdownFrontMatterParseResult,
  IMarkdownOriginData,
  IMarkdownPageLayoutOptions,
  ParseAlerts,
  ParseAngularExampleWithCodeLinks,
  ParseGroupedCodeItems,
  ParsePreviewGroup, ParseShowcase,
  ParseSingleCodeItem,
} from './index';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { catchError, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { F_PREVIEW_NAVIGATION_PROVIDER } from './domain';
import { ISeoOverrides } from '../../../analytics';

interface IMarkdownOriginDraft {
  url: string | null;
  label: string | null;
}

@Injectable()
export class MarkdownService {

  private readonly _markdown = new MarkdownIt({ html: true, linkify: true });
  private readonly _httpClient = inject(HttpClient);
  private readonly _domSanitizer = inject(DomSanitizer);
  private readonly _router = inject(Router);
  private readonly _provider = inject(F_PREVIEW_NAVIGATION_PROVIDER, { optional: true });
  private readonly _pageLayout = signal<IMarkdownPageLayoutOptions>({ ...DEFAULT_MARKDOWN_PAGE_LAYOUT_OPTIONS });
  private readonly _pageSeo = signal<ISeoOverrides | null>(null);
  private readonly _pageOrigin = signal<IMarkdownOriginData | null>(null);

  public readonly pageLayout = this._pageLayout.asReadonly();
  public readonly pageSeo = this._pageSeo.asReadonly();
  public readonly pageOrigin = this._pageOrigin.asReadonly();

  constructor() {
    this._markdown
      .use((x) => new ParseSingleCodeItem().render(x))
      .use(...new ParseAlerts().render(EMarkdownContainerType.ALERT_TIP, this._markdown))
      .use(...new ParseAlerts().render(EMarkdownContainerType.ALERT_INFO, this._markdown))
      .use(...new ParseAlerts().render(EMarkdownContainerType.ALERT_WARNING, this._markdown))
      .use(...new ParseAlerts().render(EMarkdownContainerType.ALERT_DANGER, this._markdown))
      .use(...new ParseAlerts().render(EMarkdownContainerType.ALERT_SUCCESS, this._markdown))
      .use(...new ParseGroupedCodeItems().render())
      .use(...new ParsePreviewGroup(this._provider?.getNavigation() || []).render())
      .use(...new ParseShowcase().render())
      .use(...new ParseAngularExampleWithCodeLinks().render());
  }

  public parseUrl(src: string): Observable<SafeHtml> {
    this._resetPageContext();

    return this._httpClient.get(src, { responseType: 'text' }).pipe(take(1), catchError(() => of(''))).pipe(
      switchMap((text) => of(this._renderMarkdownWithPageContext(text))),
      switchMap((x) => of(this._cleanupEmptyParagraphs(x))),
      switchMap((x) => of(this._cleanupWasteParagraphFromExampleView(x))),
      switchMap((x) => of(this._cleanupWasteParagraphFromPreviewGroup(x))),
      switchMap((x) => of(this._normalizeLinks(x))),
      switchMap((x) => of(this._domSanitizer.bypassSecurityTrustHtml(x))),
    );
  }

  public parseText(value: string): Observable<SafeHtml> {
    this._resetPageContext();

    return of(this._renderMarkdownWithPageContext(value)).pipe(
      switchMap((x) => of(this._cleanupEmptyParagraphs(x))),
      switchMap((x) => of(this._cleanupWasteParagraphFromExampleView(x))),
      switchMap((x) => of(this._cleanupWasteParagraphFromPreviewGroup(x))),
      switchMap((x) => of(this._normalizeLinks(x))),
      switchMap((x) => of(this._domSanitizer.bypassSecurityTrustHtml(x))),
    );
  }

  private _normalizeLinks(html: string): string {
    const currentPath = this._router.url;
    const prefix = currentPath.substring(0, currentPath.lastIndexOf('/'));

    return html.replace(/<a\b[^>]*>/g, (tag) => {
      const tagWithClasses = this._appendLinkClasses(tag);
      const hrefMatch = tagWithClasses.match(/\bhref=(["'])([^"']*)\1/);
      if (!hrefMatch) {
        return tagWithClasses;
      }

      const href = hrefMatch[2];
      if (this._isExternalLink(href)) {
        return tagWithClasses;
      }

      let newHref = href.substring(0);
      if (!href.startsWith('./')) {
        newHref = href.startsWith('/') ? `${prefix}${href}` : `${prefix}/${href}`;
      }

      return tagWithClasses.replace(hrefMatch[0], `href=${hrefMatch[1]}${newHref}${hrefMatch[1]}`);
    });
  }

  private _appendLinkClasses(tag: string): string {
    const classes = [ 'f-text-link', 'f-text-link-primary' ];
    const classMatch = tag.match(/\bclass=(["'])([^"']*)\1/);

    if (!classMatch) {
      return tag.replace('<a', `<a class="${classes.join(' ')}"`);
    }

    const existingClasses = classMatch[2].split(/\s+/).filter(Boolean);
    const mergedClasses = [
      ...existingClasses,
      ...classes.filter((className) => !existingClasses.includes(className)),
    ];

    return tag.replace(classMatch[0], `class=${classMatch[1]}${mergedClasses.join(' ')}${classMatch[1]}`);
  }

  private _isExternalLink(href: string): boolean {
    return href.startsWith('www') || href.startsWith('http');
  }

  private _cleanupEmptyParagraphs(html: string): string {
    return html.replace(/<p>\s*<\/p>/g, '');
  }

  private _cleanupWasteParagraphFromExampleView(html: string): string {
    return html.replace(/<div class="f-code-group-body">\s*<p>[^<]*<\/p>/g, '<div class="f-code-group-body">');
  }

  private _cleanupWasteParagraphFromPreviewGroup(html: string): string {
    return html.replace(/<p>(\[[^\]]+\](\s*\[[^\]]+\])*)<\/p>/g, '');
  }

  private _renderMarkdownWithPageContext(markdown: string): string {
    const result = this._parseFrontMatter(markdown);
    this._applyPageContext(result.data);

    return this._markdown.render(result.markdown);
  }

  private _parseFrontMatter(markdown: string): IMarkdownFrontMatterParseResult {
    const source = (markdown || '').replace(/^\uFEFF/, '');
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

    const defaults = this._getDefaultFrontMatterData();
    if (!match || !match[1].includes(':')) {
      return {
        markdown: source,
        data: defaults,
      };
    }

    const rawFrontMatter = match[1];
    const parsedData = this._parseFrontMatterData(rawFrontMatter);

    return {
      markdown: source.slice(match[0].length),
      data: parsedData,
    };
  }

  private _parseFrontMatterData(rawFrontMatter: string): IMarkdownFrontMatterData {
    const layout: IMarkdownPageLayoutOptions = { ...DEFAULT_MARKDOWN_PAGE_LAYOUT_OPTIONS };
    const seo: ISeoOverrides = {};
    const origin: IMarkdownOriginDraft = { url: null, label: null };

    rawFrontMatter
      .split(/\r?\n/)
      .forEach((line) => this._parseFrontMatterLine(line, layout, seo, origin));

    return {
      layout,
      seo: Object.keys(seo).length ? seo : null,
      origin: this._resolveOrigin(origin),
    };
  }

  private _parseFrontMatterLine(
    line: string,
    layout: IMarkdownPageLayoutOptions,
    seo: ISeoOverrides,
    origin: IMarkdownOriginDraft,
  ): void {
    const normalizedLine = line.trim();
    if (!normalizedLine || normalizedLine.startsWith('#')) {
      return;
    }

    const separatorIndex = normalizedLine.indexOf(':');
    if (separatorIndex < 0) {
      return;
    }

    const key = normalizedLine.slice(0, separatorIndex).trim().toLowerCase();
    const value = this._normalizeFrontMatterValue(normalizedLine.slice(separatorIndex + 1));
    if (!key || !value) {
      return;
    }

    const boolValue = this._parseBoolean(value);
    this._applyLayoutKey(key, boolValue, layout);
    this._applySeoKey(key, value, boolValue, seo);
    this._applyOriginKey(key, value, origin);
  }

  private _normalizeFrontMatterValue(value: string): string {
    const trimmed = value.trim();
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith('\'') && trimmed.endsWith('\''))) {
      return trimmed.slice(1, -1).trim();
    }
    return trimmed;
  }

  private _parseBoolean(value: string): boolean | null {
    const normalized = value.toLowerCase();
    if ([ 'true', '1', 'yes', 'on' ].includes(normalized)) {
      return true;
    }

    if ([ 'false', '0', 'no', 'off' ].includes(normalized)) {
      return false;
    }

    return null;
  }

  private _applyLayoutKey(key: string, boolValue: boolean | null, layout: IMarkdownPageLayoutOptions): void {
    if (boolValue === null) {
      return;
    }

    switch (key) {
      case 'toc':
      case 'showtoc':
      case 'tableofcontent':
      case 'table_of_content':
        layout.hideTableOfContent = !boolValue;
        return;
      case 'hidetoc':
      case 'hide_toc':
        layout.hideTableOfContent = boolValue;
        return;
      case 'widecontent':
      case 'expandcontent':
      case 'expandwithouttoc':
      case 'expand_no_toc':
      case 'widetableofcontentgap':
        layout.expandContentWithoutTableOfContent = boolValue;
        return;
    }
  }

  private _applySeoKey(key: string, value: string, boolValue: boolean | null, seo: ISeoOverrides): void {
    switch (key) {
      case 'title':
      case 'seotitle':
        seo.title = value;
        return;
      case 'description':
      case 'seodescription':
        seo.description = value;
        return;
      case 'canonical':
      case 'seocanonical':
        seo.canonical = value;
        return;
      case 'keywords':
      case 'seokeywords':
        seo.keywords = value;
        return;
      case 'robots':
      case 'seorobots':
        seo.robots = value;
        return;
      case 'image':
      case 'seoimage':
        seo.image = value;
        return;
      case 'imagetype':
      case 'image_type':
        seo.image_type = value;
        return;
      case 'imagewidth':
      case 'image_width':
        seo.image_width = this._parseNumberOrDefault(value, seo.image_width);
        return;
      case 'imageheight':
      case 'image_height':
        seo.image_height = this._parseNumberOrDefault(value, seo.image_height);
        return;
      case 'ogtype':
      case 'og_type':
        seo.og_type = value;
        return;
      case 'ogtitle':
      case 'og_title':
        seo.og_title = value;
        return;
      case 'ogdescription':
      case 'og_description':
        seo.og_description = value;
        return;
      case 'ogimage':
      case 'og_image':
        seo.og_image = value;
        return;
      case 'twittercard':
      case 'twitter_card':
        seo.twitter_card = value;
        return;
      case 'twittertitle':
      case 'twitter_title':
        seo.twitter_title = value;
        return;
      case 'twitterdescription':
      case 'twitter_description':
        seo.twitter_description = value;
        return;
      case 'twitterimage':
      case 'twitter_image':
        seo.twitter_image = value;
        return;
      case 'noindex':
        if (boolValue !== null) {
          seo.noindex = boolValue;
        }
        return;
      case 'nofollow':
        if (boolValue !== null) {
          seo.nofollow = boolValue;
        }
        return;
    }
  }

  private _applyOriginKey(key: string, value: string, origin: IMarkdownOriginDraft): void {
    switch (key) {
      case 'origin':
      case 'originurl':
      case 'origin_url':
      case 'original':
      case 'originalurl':
      case 'original_url':
      case 'source':
      case 'sourceurl':
      case 'source_url': {
        const normalizedUrl = this._normalizeOriginUrl(value);
        if (normalizedUrl) {
          origin.url = normalizedUrl;
        }
        return;
      }
      case 'originlabel':
      case 'origin_label':
      case 'origintext':
      case 'origin_text':
      case 'sourcelabel':
      case 'source_label':
        origin.label = value;
        return;
    }
  }

  private _normalizeOriginUrl(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${ trimmed }`;

    try {
      const url = new URL(candidate);
      if (![ 'http:', 'https:' ].includes(url.protocol)) {
        return null;
      }
      return url.toString();
    } catch {
      return null;
    }
  }

  private _resolveOrigin(origin: IMarkdownOriginDraft): IMarkdownOriginData | null {
    if (!origin.url) {
      return null;
    }

    return {
      url: origin.url,
      label: origin.label || this._getOriginLabel(origin.url),
    };
  }

  private _getOriginLabel(originUrl: string): string {
    try {
      const hostname = new URL(originUrl).hostname.toLowerCase().replace(/^www\./, '');
      if (hostname === 'medium.com' || hostname.endsWith('.medium.com')) {
        return 'Originally published on Medium';
      }

      return `Originally published on ${ hostname }`;
    } catch {
      return 'Originally published externally';
    }
  }

  private _parseNumberOrDefault(value: string, fallback: number | undefined): number | undefined {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      return fallback;
    }
    return numericValue;
  }

  private _applyPageContext(data: IMarkdownFrontMatterData): void {
    this._pageLayout.set({ ...data.layout });
    this._pageSeo.set(data.seo ? { ...data.seo } : null);
    this._pageOrigin.set(data.origin ? { ...data.origin } : null);
  }

  private _resetPageContext(): void {
    this._applyPageContext(this._getDefaultFrontMatterData());
  }

  private _getDefaultFrontMatterData(): IMarkdownFrontMatterData {
    return {
      layout: { ...DEFAULT_MARKDOWN_PAGE_LAYOUT_OPTIONS },
      seo: null,
      origin: null,
    };
  }
}
