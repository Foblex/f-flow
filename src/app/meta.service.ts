import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, startWith, Subscription } from 'rxjs';
import { ENGLISH_ENVIRONMENT } from '../../public/docs/en/environment';
import { Meta, Title } from '@angular/platform-browser';
import { INavigationGroup, INavigationItem } from '@foblex/f-docs';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class MetaService {

  constructor(
    private router: Router,
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document,
  ) {
  }

  public subscribeOnRouteChanges(): Subscription {
    return this.router.events.pipe(
      startWith(new NavigationEnd(1, '', '')),
      filter(event => event instanceof NavigationEnd),
    ).subscribe((x) => {
      let data = {
        ...DEFAULT_PAGE_DATA,
      }
      const item = this.findDocItemByUrl(this.findDocGroupByUrl(window.location.href), window.location.href);
      if (item) {
        data.title = `${ ENGLISH_ENVIRONMENT.title } - ${ item.text }`;
        data.url = window.location.href;
        data.description = item.description || DEFAULT_PAGE_DATA.description;
        data.image = item.image || DEFAULT_PAGE_DATA.image;
        data.image_width = item.image_width || DEFAULT_PAGE_DATA.image_width;
        data.image_height = item.image_height || DEFAULT_PAGE_DATA.image_height;
        data.image_type = item.image_type || DEFAULT_PAGE_DATA.image_type;
      }
      this.updateMetaTags(data);
      this.updateJsonLD(data);
    });
  }

  private findDocGroupByUrl(url: string): INavigationGroup | undefined {
    return ENGLISH_ENVIRONMENT.navigation.find((g) => g.items.find((i) => url.endsWith(i.link)));
  }

  private findDocItemByUrl(group: INavigationGroup | undefined, url: string): INavigationItem | undefined {
    return (group?.items || []).find((i) => url.endsWith(i.link));
  }

  private updateJsonLD(item: IPageMetaOg): void {
    const oldScript = this.document.querySelector('script[type="application/ld+json"]');
    oldScript?.remove();

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": item.title,
      "description": item.description,
      "image": item.image,
      "url": item.url
    });
  }

  private updateMetaTags(item: IPageMetaOg): void {
    this.title.setTitle(item.title);

    this.meta.updateTag({ property: 'og:url', content: item.url });
    this.meta.updateTag({ property: 'og:type', content: item.type });
    this.meta.updateTag({ property: 'og:title', content: item.title });
    this.meta.updateTag({ property: 'og:site_name', content: item.site_name });
    this.meta.updateTag({ property: 'og:locale', content: item.locale });
    this.meta.updateTag({ property: 'og:description', content: item.description });
    this.meta.updateTag({ property: 'og:image', content: item.image });
    this.meta.updateTag({ property: 'og:image:secure_url', content: item.image });
    this.meta.updateTag({ property: 'og:image:type', content: item.image_type });
    this.meta.updateTag({ property: 'og:image:width', content: item.image_width.toString() });
    this.meta.updateTag({ property: 'og:image:height', content: item.image_height.toString() });

    this.meta.updateTag({ name: 'description', content: item.description });

    this.meta.updateTag({ name: 'canonical', content: item.url });
  }
}

const DEFAULT_PAGE_DATA: IPageMetaOg = {
  url: 'https://flow.foblex.com',
  type: 'website',
  title: ENGLISH_ENVIRONMENT.title,
  site_name: ENGLISH_ENVIRONMENT.title,
  locale: ENGLISH_ENVIRONMENT.lang,
  description: 'An Angular library designed to simplify the creation and manipulation of dynamic flow. Provides components for flows, nodes, and connections, automating node manipulation and inter-node connections.',
  image: 'https://flow.foblex.com/site-preview.png',
  image_type: 'image/png',
  image_width: 3116,
  image_height: 1880
};

interface IPageMetaOg {

  url: string;

  type: string;

  title: string;

  site_name: string;

  locale: string;

  description: string;

  image: string;

  image_type: string;

  image_width: number;

  image_height: number;
}
