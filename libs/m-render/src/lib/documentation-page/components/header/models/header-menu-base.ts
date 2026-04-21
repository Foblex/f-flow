import { computed, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map, startWith } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HEADER_CONFIGURATION_PROVIDER } from '../../../../common';

export class HeaderMenuBase {
  private readonly _router = inject(Router);
  private readonly _baseNav = inject(HEADER_CONFIGURATION_PROVIDER)?.navigation ?? [];

  private readonly _url = toSignal(
    this._router.events.pipe(
      startWith(null),
      filter((e): e is NavigationEnd | null => e === null || e instanceof NavigationEnd),
      map(() => this._router.url),
      distinctUntilChanged(),
    ),
    { initialValue: this._router.url },
  );

  public readonly navigation = computed(() => {
    const url = this._cleanPath(this._url());
    return this._baseNav.map(item => ({
      ...item,
      isActive: this._isActive(url, this._cleanPath(item.active ?? '')),
    }));
  });

  private _cleanPath(url: string): string {
    return url.split('#')[0].split('?')[0].replace(/\/{2,}/g, '/').replace(/\/$/, '');
  }

  private _isActive(currentPath: string, itemLink: string): boolean {
    if (!itemLink) return false;
    return currentPath === itemLink || currentPath.startsWith(itemLink + '/');
  }
}
