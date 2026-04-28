import { ChangeDetectionStrategy, Component, computed, HostListener, inject } from '@angular/core';
import { distinctUntilChanged, map, startWith } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  GetPreviousNextPageNavigationHandler,
  GetPreviousNextPageNavigationRequest,
  IMarkdownFooterLink,
} from './domain';
import { toSignal } from '@angular/core/rxjs-interop';
import { DocumentationStore } from '../../../services';
import { HandleNavigationLinksHandler, HandleNavigationLinksRequest } from '../../../domain';
import { WINDOW } from '../../../../common';
import { FooterNavigationButton } from './footer-navigation-button';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'markdown-footer',
  templateUrl: './markdown-footer.html',
  styleUrls: ['./markdown-footer.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FooterNavigationButton],
  standalone: true,
})
export class MarkdownFooter {
  private readonly _provider = inject(DocumentationStore);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _window = inject(WINDOW);

  protected readonly navigation = this._provider.getFooterNavigation();

  private readonly _url = toSignal(
    this._router.events.pipe(
      startWith(null),
      filter((e): e is NavigationEnd | null => e === null || e instanceof NavigationEnd),
      map(() => this._router.url),
      distinctUntilChanged(),
    ),
    { initialValue: this._router.url },
  );

  private readonly _currentLink = computed(() => {
    this._url();

    return this._activatedRoute.snapshot.url.map((s) => s.path).join('/');
  });

  private readonly _prefix = computed(() => {
    const url = this._url();
    const idx = url.lastIndexOf('/');

    return idx > 0 ? url.substring(0, idx) : '';
  });

  protected readonly editLink = computed<string | undefined>(() => {
    const nav = this.navigation;
    if (!nav.editLink?.pattern) return undefined;
    const slug = this._currentLink();
    const relative = this._provider.getMarkdownPath(slug) ?? `${slug}.md`;

    return nav.editLink.pattern + relative;
  });

  protected readonly previousLink = computed<IMarkdownFooterLink | undefined>(() => {
    const prevNext = new GetPreviousNextPageNavigationHandler(this._provider).handle(
      new GetPreviousNextPageNavigationRequest(this._currentLink()),
    );

    return this._normalizeLink(prevNext.previousLink);
  });

  protected readonly nextLink = computed<IMarkdownFooterLink | undefined>(() => {
    const prevNext = new GetPreviousNextPageNavigationHandler(this._provider).handle(
      new GetPreviousNextPageNavigationRequest(this._currentLink()),
    );

    return this._normalizeLink(prevNext.nextLink);
  });

  private _normalizeLink(item?: IMarkdownFooterLink): IMarkdownFooterLink | undefined {
    if (!item?.link) return item;
    if (this._isExternal(item.link)) return item;

    const prefix = this._prefix();
    const joined = (prefix ? `${prefix}/${item.link}` : item.link).replace(/\/{2,}/g, '/');

    return { ...item, link: joined.startsWith('/') ? joined : `/${joined}` };
  }

  private _isExternal(href: string): boolean {
    return /^(?:[a-z]+:)?\/\//i.test(href) || href.startsWith('www.');
  }

  @HostListener('click', ['$event'])
  protected _click(event: MouseEvent): void {
    new HandleNavigationLinksHandler().handle(
      new HandleNavigationLinksRequest(event, this._window, this._router),
    );
  }
}
