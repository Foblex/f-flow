import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable, startWith } from 'rxjs';
import { IMetaData } from './i-meta-data';
import { FHeadTagService } from './f-head-tag.service';
import { tap } from 'rxjs/operators';
import { DOCUMENTATION_CONFIGURATION } from '../../domain';
import { INavigationGroup, INavigationItem } from '../../components';
import { LOCATION } from '../../../common';
import { ISeoOverrides } from './i-seo-overrides';

@Injectable()
export class FMetaService {
  private readonly _document = inject(DOCUMENT);
  private readonly _location = inject(LOCATION);
  private readonly _router = inject(Router);
  private readonly _headTag = inject(FHeadTagService);
  private readonly _configuration = inject(DOCUMENTATION_CONFIGURATION);
  private _seoOverrides: ISeoOverrides | null = null;
  private _lastPath = '';

  public changes(): Observable<string> {
    return this._router.events.pipe(
      startWith(null),
      filter((e): e is NavigationEnd | null => e === null || e instanceof NavigationEnd),
      map(() => this._normalizeCurrentPath(this._router.url)),
      tap((currentUrl) => {
        if (this._lastPath !== currentUrl) {
          this._seoOverrides = null;
          this._lastPath = currentUrl;
        }
        this._updateMetaByUrl(currentUrl);
      }),
    );
  }

  public applyMarkdownSeo(overrides: ISeoOverrides | null | undefined): void {
    this._seoOverrides = overrides ? { ...overrides } : null;
    this._updateMetaByUrl(this._normalizeCurrentPath(this._router.url));
  }

  public dispose(): void {
    this._seoOverrides = null;
    this._lastPath = '';
    this._removeStructuredData();

    if (!this._configuration.meta) {
      return;
    }
    this._updateMetaTags(this._configuration.meta);
  }

  private _updateMetaByUrl(currentUrl: string): void {
    const defaultData = this._configuration.meta;
    if (!defaultData) {
      return;
    }

    const data = { ...defaultData };
    const item = this._findDocItemByUrl(this._findDocGroupByUrl(currentUrl), currentUrl);

    if (item) {
      const baseTitle = item.pageTitle || item.text;
      data.title = item.pageTitleIsFinal ? baseTitle : `${baseTitle} | ${defaultData.app_name}`;
      data.url = this._buildAbsoluteUrl(currentUrl);
      data.canonical = item.canonical;
      data.description = item.description || defaultData.description;
      data.image = item.image || defaultData.image;
      data.image_width = item.image_width || defaultData.image_width;
      data.image_height = item.image_height || defaultData.image_height;
      data.image_type = item.image_type || defaultData.image_type;
      if (item.og_type) {
        data.type = item.og_type;
      }
    }

    if (!data.url) {
      data.url = this._buildAbsoluteUrl(currentUrl);
    }

    data.url = this._toAbsoluteUrl(data.url);
    if (data.image) {
      data.image = this._toAbsoluteUrl(data.image);
    }

    this._updateMetaTags(data);

    if (item) {
      this._updateStructuredData(currentUrl, item, data);
    } else {
      this._removeStructuredData();
    }
  }

  private _findDocGroupByUrl(url: string): INavigationGroup | undefined {
    return (this._configuration.navigation || []).find((g: INavigationGroup) =>
      g.items.find((i: INavigationItem) => url.endsWith(i.link)),
    );
  }

  private _findDocItemByUrl(
    group: INavigationGroup | undefined,
    url: string,
  ): INavigationItem | undefined {
    return (group?.items || []).find((i: INavigationItem) => url.endsWith(i.link));
  }

  private _buildAbsoluteUrl(url: string): string {
    try {
      return new URL(url, this._location.origin).toString();
    } catch {
      return this._location.origin + url;
    }
  }

  private _toAbsoluteUrl(maybeRelative: string): string {
    try {
      return new URL(maybeRelative, this._location.origin).toString();
    } catch {
      return maybeRelative;
    }
  }

  private _updateMetaTags(item: IMetaData): void {
    const seo = this._seoOverrides || null;
    const title = seo?.title || item.title;
    const description = seo?.description || item.description;
    const url = this._toAbsoluteUrl(seo?.url || item.url);
    const canonical = this._toAbsoluteUrl(seo?.canonical || item.canonical || url);
    const type = seo?.og_type || seo?.type || item.type;
    const siteName = seo?.app_name || item.app_name;
    const locale = seo?.locale || item.locale;
    const image = this._toAbsoluteUrl(seo?.og_image || seo?.image || item.image);
    const imageType = seo?.image_type || item.image_type;
    const imageWidth = seo?.image_width || item.image_width;
    const imageHeight = seo?.image_height || item.image_height;
    const keywords = seo?.keywords || item.keywords || '';
    const robots = this._resolveRobots(item.robots, seo);

    const twitterCard = seo?.twitter_card || item.twitter_card || 'summary_large_image';
    const twitterSite = item.twitter_site || '';
    const twitterCreator = item.twitter_creator || '';
    const twitterTitle = seo?.twitter_title || seo?.og_title || title;
    const twitterDescription = seo?.twitter_description || seo?.og_description || description;
    const twitterImage = this._toAbsoluteUrl(seo?.twitter_image || image);

    this._headTag.setTitle(title);
    this._headTag.setDescription(description);
    this._headTag.setCanonical(canonical);

    this._headTag.updateTag({ property: 'og:url', content: url });
    this._headTag.updateTag({ property: 'og:type', content: type });
    this._headTag.updateTag({ property: 'og:title', content: seo?.og_title || title });
    this._headTag.updateTag({ property: 'og:site_name', content: siteName });
    this._headTag.updateTag({ property: 'og:locale', content: locale });
    this._headTag.updateTag({
      property: 'og:description',
      content: seo?.og_description || description,
    });
    this._headTag.updateTag({ property: 'og:image', content: image });
    this._headTag.updateTag({ property: 'og:image:secure_url', content: image });
    this._headTag.updateTag({ property: 'og:image:type', content: imageType });
    this._headTag.updateTag({
      property: 'og:image:width',
      content: imageWidth ? imageWidth.toString() : '',
    });
    this._headTag.updateTag({
      property: 'og:image:height',
      content: imageHeight ? imageHeight.toString() : '',
    });

    this._headTag.updateNameTag({ name: 'keywords', content: keywords });
    this._headTag.updateNameTag({ name: 'robots', content: robots });
    this._headTag.updateNameTag({ name: 'twitter:card', content: twitterCard });
    this._headTag.updateNameTag({ name: 'twitter:site', content: twitterSite });
    this._headTag.updateNameTag({ name: 'twitter:creator', content: twitterCreator });
    this._headTag.updateNameTag({ name: 'twitter:title', content: twitterTitle });
    this._headTag.updateNameTag({ name: 'twitter:description', content: twitterDescription });
    this._headTag.updateNameTag({ name: 'twitter:image', content: twitterImage });
  }

  private _updateStructuredData(currentUrl: string, item: INavigationItem, meta: IMetaData): void {
    const seo = this._seoOverrides;
    const canonical = this._toAbsoluteUrl(seo?.canonical || meta.canonical || meta.url);
    const title = seo?.title || meta.title;
    const description = seo?.description || meta.description;
    const image = this._toAbsoluteUrl(seo?.og_image || seo?.image || meta.image);
    const type = seo?.og_type || seo?.type || meta.type;
    const siteOrigin = this._toAbsoluteUrl('/');
    const websiteId = `${siteOrigin}#website`;
    const organizationId = `${siteOrigin}#organization`;
    const pageId = `${canonical}#webpage`;
    const articleId = `${canonical}#article`;
    const breadcrumbId = `${canonical}#breadcrumb`;
    const sectionUrl = this._toAbsoluteUrl(
      this._configuration.meta?.canonical || this._configuration.meta?.url || currentUrl,
    );
    const breadcrumbItems: Record<string, unknown>[] = [
      {
        '@type': 'ListItem',
        position: 1,
        name: meta.app_name,
        item: siteOrigin,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: this._sectionName(currentUrl),
        item: sectionUrl,
      },
    ];

    if (canonical !== sectionUrl) {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 3,
        name: item.text,
        item: canonical,
      });
    }

    const breadcrumb = {
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: breadcrumbItems,
    };
    const commonPageData = {
      '@id': pageId,
      url: canonical,
      name: title,
      description,
      isPartOf: { '@id': websiteId },
      breadcrumb: { '@id': breadcrumbId },
      ...(image ? { image } : {}),
    };
    const page = {
      '@type': 'WebPage',
      ...commonPageData,
      ...(type === 'article' ? { mainEntity: { '@id': articleId } } : {}),
    };
    const graphNodes: Record<string, unknown>[] = [breadcrumb, page];

    if (type === 'article') {
      const datePublished = this._dateValue(seo?.date_published, item.date);
      const dateModified = this._dateValue(seo?.date_modified, item.date);

      graphNodes.push({
        '@type': 'TechArticle',
        '@id': articleId,
        url: canonical,
        name: title,
        headline: title,
        description,
        isPartOf: { '@id': websiteId },
        mainEntityOfPage: { '@id': pageId },
        publisher: {
          '@type': 'Organization',
          '@id': organizationId,
          name: 'Foblex',
          url: siteOrigin,
        },
        ...(image ? { image } : {}),
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
      });
    }

    const graph = {
      '@context': 'https://schema.org',
      '@graph': graphNodes,
    };
    const pageScripts = this._document.head.querySelectorAll(
      'script[type="application/ld+json"][data-ld-page="true"]',
    );

    pageScripts.forEach((node) => node.remove());

    const script = this._document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-ld-id', 'm-render-page');
    script.setAttribute('data-ld-page', 'true');
    script.textContent = JSON.stringify(graph).replaceAll('<', '\\u003c');
    this._document.head.appendChild(script);
  }

  private _removeStructuredData(): void {
    this._document.head
      .querySelector('script[type="application/ld+json"][data-ld-id="m-render-page"]')
      ?.remove();
  }

  private _sectionName(currentUrl: string): string {
    const section = currentUrl.split('/').filter(Boolean)[0] || 'docs';

    if (section === 'blog') {
      return 'Articles';
    }

    return section.charAt(0).toUpperCase() + section.slice(1);
  }

  private _dateValue(value: string | undefined, fallback: Date | undefined): string | null {
    const candidate = value || fallback?.toISOString();
    const match = candidate?.match(/^(\d{4}-\d{2}-\d{2})/u);

    return match?.[1] || null;
  }

  private _resolveRobots(defaultRobots: string | undefined, seo: ISeoOverrides | null): string {
    if (seo?.robots) {
      return seo.robots;
    }

    const hasDirectiveOverride =
      typeof seo?.noindex === 'boolean' || typeof seo?.nofollow === 'boolean';
    if (!hasDirectiveOverride) {
      return defaultRobots || '';
    }

    const indexValue = seo?.noindex ? 'noindex' : 'index';
    const followValue = seo?.nofollow ? 'nofollow' : 'follow';
    const defaultTokens = (defaultRobots || '')
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x && !['index', 'noindex', 'follow', 'nofollow'].includes(x.toLowerCase()));

    return [indexValue, followValue, ...defaultTokens].join(', ');
  }

  private _normalizeCurrentPath(url: string): string {
    return (url || '').split('#')[0].split('?')[0];
  }
}
