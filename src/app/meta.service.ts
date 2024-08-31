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
      this.meta.updateTag({ name: 'canonical', content: window.location.href });
      const item = this.findDocItemByUrl(this.findDocGroupByUrl(window.location.href), window.location.href);
      if (item) {
        this.title.setTitle(`${ ENGLISH_ENVIRONMENT.title } - ${ item.text }`);
      }
      this.updateJsonLD(item);
    });
  }

  private findDocGroupByUrl(url: string): INavigationGroup | undefined {
    return ENGLISH_ENVIRONMENT.navigation.find((g) => g.items.find((i) => url.endsWith(i.link)));
  }

  private findDocItemByUrl(group: INavigationGroup | undefined, url: string): INavigationItem | undefined {
    return (group?.items || []).find((i) => url.endsWith(i.link));
  }

  private updateJsonLD(item: INavigationItem | undefined): void {
    const oldScript = this.document.querySelector('script[type="application/ld+json"]');
    oldScript?.remove();

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": item?.text || DEFAULT_PAGE_DATA.title,
      "description": item?.description || DEFAULT_PAGE_DATA.description,
      "image": item?.image || DEFAULT_PAGE_DATA.image,
      "url": item?.text ? window.location.href : DEFAULT_PAGE_DATA.url,
    });
  }
}

const DEFAULT_PAGE_DATA = {
  title: 'Foblex Flow',
  description: 'An Angular library designed to simplify the creation and manipulation of dynamic flow. Provides components for flows, nodes, and connections, automating node manipulation and inter-node connections.',
  url: 'https://flow.foblex.com',
  image: 'https://flow.foblex.com/site-preview.png',
};
