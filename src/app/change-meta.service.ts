import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, startWith, Subscription } from 'rxjs';
import { ENGLISH_ENVIRONMENT } from '../../public/docs/en/environment';
import { Meta, Title } from '@angular/platform-browser';
import { INavigationGroup, INavigationItem } from '@foblex/f-docs';

@Injectable({ providedIn: 'root' })
export class ChangeMetaService {

  constructor(
    private router: Router,
    private meta: Meta,
    private title: Title
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
    });
  }

  private findDocGroupByUrl(url: string): INavigationGroup | undefined {
    return ENGLISH_ENVIRONMENT.navigation.find((g) => g.items.find((i) => url.endsWith(i.link)));
  }

  private findDocItemByUrl(group: INavigationGroup | undefined, url: string): INavigationItem | undefined {
    return (group?.items || []).find((i) => url.endsWith(i.link));
  }
}
