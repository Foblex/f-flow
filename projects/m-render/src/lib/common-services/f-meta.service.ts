import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, startWith, Subscription } from 'rxjs';
import { BrowserService } from '@foblex/platform';
import { INavigationGroup, INavigationItem } from '../f-documentation';
import { IMetaData } from '../domain/i-meta-data';
import { IDocsEnvironment } from '../f-documentation';
import { FHeadTagService } from './index';

@Injectable({ providedIn: 'root' })
export class FMetaService {

  private navigation: INavigationGroup[] = [];

  constructor(
    private router: Router,
    private fHeadTag: FHeadTagService,
    private fBrowser: BrowserService
  ) {
  }

  public subscribeOnRouteChanges(defaultData: IMetaData, environments: IDocsEnvironment[]): Subscription {
    this.navigation = environments.reduce((result: INavigationGroup[], e) => result.concat(...e.navigation), []);
    return this.router.events.pipe(
      startWith(new NavigationEnd(1, '', '')),
      filter(event => event instanceof NavigationEnd),
    ).subscribe((x) => {
      let data = {
        ...defaultData,
      };
      const item = this.findDocItemByUrl(this.findDocGroupByUrl(this.router.url), this.router.url);
      if (item) {
        data.title = `${ item.text } - ${ defaultData.app_name }`;
        data.url = this.fBrowser.window.location.href;
        data.description = item.description || defaultData.description;
        data.image = item.image || defaultData.image;
        data.image_width = item.image_width || defaultData.image_width;
        data.image_height = item.image_height || defaultData.image_height;
        data.image_type = item.image_type || defaultData.image_type;
      }
      if (!data.url) {
        data.url = this.fBrowser.window.location.origin + this.router.url;
      }
      if (!data.image.startsWith('http') && !data.image.startsWith('www')) {
        if (data.image.startsWith('.')) {
          data.image = this.fBrowser.window.location.origin + data.image.slice(1);
        } else {
          data.image = this.fBrowser.window.location.origin + data.image;
        }
      }
      if (!data.url.endsWith('/')) {
        data.url += '/';
      }

      this.updateMetaTags(data);
    });
  }

  private findDocGroupByUrl(url: string): INavigationGroup | undefined {
    return this.navigation.find((g: INavigationGroup) => g.items.find((i: INavigationItem) => url.endsWith(i.link)));
  }

  private findDocItemByUrl(group: INavigationGroup | undefined, url: string): INavigationItem | undefined {
    return (group?.items || []).find((i: INavigationItem) => url.endsWith(i.link));
  }

  private updateMetaTags(item: IMetaData): void {
    this.fHeadTag.setTitle(item.title);
    this.fHeadTag.setDescription(item.description);
    this.fHeadTag.setCanonical(item.url);

    this.fHeadTag.updateTag({ property: 'og:url', content: item.url });
    this.fHeadTag.updateTag({ property: 'og:type', content: item.type });
    this.fHeadTag.updateTag({ property: 'og:title', content: item.title });
    this.fHeadTag.updateTag({ property: 'og:site_name', content: item.title });
    this.fHeadTag.updateTag({ property: 'og:locale', content: item.locale });
    this.fHeadTag.updateTag({ property: 'og:description', content: item.description });
    this.fHeadTag.updateTag({ property: 'og:image', content: item.image });
    this.fHeadTag.updateTag({ property: 'og:image:secure_url', content: item.image });
    this.fHeadTag.updateTag({ property: 'og:image:type', content: item.image_type });
    this.fHeadTag.updateTag({ property: 'og:image:width', content: item.image_width.toString() });
    this.fHeadTag.updateTag({ property: 'og:image:height', content: item.image_height.toString() });
  }
}


