import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { startWith } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FNavigationItemComponent } from './f-navigation-item/f-navigation-item.component';
import { NavigationGroupComponent } from './navigation-group/navigation-group.component';
import { INavigationItem } from './domain';
import { TOGGLE_NAVIGATION_COMPONENT } from '../header';
import { DocumentationStore } from '../../services';
import { HandleNavigationLinksHandler, HandleNavigationLinksRequest } from '../../domain';
import { WINDOW } from '../../../common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'f-navigation-panel',
  templateUrl: './navigation-panel.component.html',
  styleUrls: ['./navigation-panel.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FNavigationItemComponent,
    NavigationGroupComponent,
    RouterLink,
  ],
})
export class NavigationPanelComponent implements OnInit, AfterViewInit {
  private readonly _provider = inject(DocumentationStore);
  private readonly _parent = inject(TOGGLE_NAVIGATION_COMPONENT, {
    optional: true,
  });
  private readonly _router = inject(Router);
  private readonly _changeDetectorRef = inject(ChangeDetectorRef);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _window = inject(WINDOW);

  protected value: string | undefined;
  protected navigation = this._provider.getNavigation();
  protected title = this._provider.getTitle();
  protected image = this._provider.getLogo();

  public ngOnInit(): void {
    const currentPath = this._router.url;
    const prefix = currentPath.substring(0, currentPath.lastIndexOf('/'));
    const navigation = this._deepClone(this._provider.getNavigation());
    navigation.forEach((group) => {
      group.items.forEach((item) => this._normalizeLink(item, prefix));
    });
    this.navigation = navigation;
  }

  private _deepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }

  private _normalizeLink(item: INavigationItem, prefix: string): void {
    if (item.link && !this._isExternalLink(item.link)) {
      item.link = item.link.startsWith('/')
        ? `${prefix}${item.link}`
        : `${prefix}/${item.link}`;
    }
  }

  private _isExternalLink(href: string): boolean {
    return href.startsWith('www') || href.startsWith('http');
  }

  public ngAfterViewInit(): void {
    this._subscribeOnRouteChanges();
  }

  private _subscribeOnRouteChanges(): void {
    this._router.events
      .pipe(
        startWith(new NavigationEnd(1, '', '')),
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => {
        this._highlightLink(this._router.url);
        this._parent?.onToggleNavigation(false);
        this._changeDetectorRef.detectChanges();
      });
  }

  private _highlightLink(url: string): void {
    this.value = undefined;
    this.navigation.forEach((group) => {
      this.value =
        group.items.find((x) => {
          return url.endsWith(x.link);
        })?.link || this.value;
    });
  }

  @HostListener('click', ['$event'])
  protected _onDocumentClick(event: MouseEvent): void {
    new HandleNavigationLinksHandler().handle(
      new HandleNavigationLinksRequest(event, this._window, this._router),
    );
  }
}
