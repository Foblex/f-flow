import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoOptions {
  readonly title: string;

  readonly description: string;

  readonly canonicalUrl: string;

  readonly ogImage?: string;

  readonly robots?: string;
}

const DEFAULT_OG_IMAGE = 'https://flow.foblex.com/site-preview.png';

/**
 * Single place that sets the page title + description + canonical +
 * Open Graph + Twitter Card tags for portal-owned pages (home, services,
 * etc.). Mirrors what m-render sets for markdown-backed pages.
 */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly _title = inject(Title);
  private readonly _meta = inject(Meta);
  private readonly _document = inject(DOCUMENT);

  public apply(options: SeoOptions): void {
    const image = options.ogImage ?? DEFAULT_OG_IMAGE;
    const robots = options.robots ?? 'index, follow, max-image-preview:large';

    this._title.setTitle(options.title);
    this._meta.updateTag({ name: 'description', content: options.description });
    this._meta.updateTag({ name: 'robots', content: robots });

    this._meta.updateTag({ property: 'og:title', content: options.title });
    this._meta.updateTag({ property: 'og:description', content: options.description });
    this._meta.updateTag({ property: 'og:url', content: options.canonicalUrl });
    this._meta.updateTag({ property: 'og:image', content: image });

    this._meta.updateTag({ name: 'twitter:title', content: options.title });
    this._meta.updateTag({ name: 'twitter:description', content: options.description });
    this._meta.updateTag({ name: 'twitter:image', content: image });

    this._setCanonical(options.canonicalUrl);
  }

  private _setCanonical(url: string): void {
    let link = this._document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

    if (!link) {
      link = this._document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this._document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
