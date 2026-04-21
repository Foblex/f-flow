import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  F_PREVIEW_NAVIGATION_PROVIDER,
  HeaderComponent,
  IToggleNavigationComponent, MEDIA_LINKS_PROVIDER,
  NavigationPanelComponent,
  ScrollableContainer,
  TOGGLE_NAVIGATION_COMPONENT,
} from './components';
import { DocumentationStore } from './services';
import {
  HEADER_CONFIGURATION_PROVIDER, IS_BROWSER_PLATFORM,
  PopoverService,
  ThemeService,
} from '../common';
import { FMetaService } from './analytics';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CookiePopup } from '../analytics/cookie-popup/cookie-popup';
import { GTagService } from '../analytics';
import { EXTERNAL_COMPONENT_PROVIDER, SHOWCASE_DATA } from '../dynamic-components';

@Component({
  selector: 'documentation',
  templateUrl: './documentation.html',
  styleUrls: ['./documentation.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DocumentationStore,
    FMetaService,
    {
      provide: F_PREVIEW_NAVIGATION_PROVIDER,
      useExisting: DocumentationStore,
    },
    {
      provide: MEDIA_LINKS_PROVIDER,
      deps: [DocumentationStore],
      useFactory: (store: DocumentationStore) => store.getMediaLinks(),
    },
    {
      provide: HEADER_CONFIGURATION_PROVIDER,
      deps: [DocumentationStore],
      useFactory: (store: DocumentationStore) => store.getHeader(),
    },
    {
      provide: TOGGLE_NAVIGATION_COMPONENT,
      useExisting: Documentation,
    },
    {
      provide: EXTERNAL_COMPONENT_PROVIDER,
      deps: [DocumentationStore],
      useFactory: (store: DocumentationStore) => store.getComponents(),
    },
    {
      provide: SHOWCASE_DATA,
      deps: [DocumentationStore],
      useFactory: (store: DocumentationStore) => store.getShowcaseItems(),
    },
  ],
  imports: [
    NavigationPanelComponent,
    ScrollableContainer,
    RouterOutlet,
    HeaderComponent,
    CookiePopup,
  ],
})
export class Documentation implements IToggleNavigationComponent, OnInit, OnDestroy {
  protected readonly isNavigationVisible = signal<boolean>(false);
  protected readonly popover = inject(PopoverService).message;

  private readonly _metaService = inject(FMetaService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _gTagService = inject(GTagService, { optional: true });
  private readonly _themeService = inject(ThemeService, { optional: true });

  protected readonly emptyNavigation = !inject(DocumentationStore).getNavigation().length;

  protected readonly isBrowser = inject(IS_BROWSER_PLATFORM);

  public ngOnInit() {
    if (!this.isBrowser) {
      return;
    }
    this._themeService?.initialize();
    this._gTagService?.initialize();
    this._metaService.changes().pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  public onToggleNavigation(value: boolean): void {
    this.isNavigationVisible.set(value);
  }

  public ngOnDestroy(): void {
    this._metaService.dispose();
    // Cleanup logic if needed
  }
}
