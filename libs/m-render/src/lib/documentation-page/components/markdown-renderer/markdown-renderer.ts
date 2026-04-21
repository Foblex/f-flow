import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  Injector,
  input,
  OnDestroy,
  OnInit,
  untracked,
  ViewContainerRef,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DynamicComponentsStore } from '../../services';
import { HandleNavigationLinksHandler, HandleNavigationLinksRequest } from '../../domain';
import { IS_BROWSER_PLATFORM, WINDOW } from '../../../common';
import { MarkdownFooter } from './markdown-footer';
import { Mediatr } from '../../../mediatr';
import { RenderInternalComponentsRequest } from '../../../dynamic-components';
import { CalculateTableOfContentRequest } from '../table-of-content';
import { SCROLLABLE_CONTAINER } from '../scrollable-container';
import type { IMarkdownOriginData } from './utils';

@Component({
  selector: 'markdown-renderer',
  templateUrl: './markdown-renderer.html',
  styleUrls: ['./markdown-renderer.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownFooter],
  host: {
    class: 'm-render',
  },
})
export class MarkdownRenderer implements OnInit, OnDestroy {
  public readonly value = input.required<SafeHtml | undefined>();
  public readonly origin = input<IMarkdownOriginData | null>(null);

  private readonly _hostElement = inject(ElementRef).nativeElement;
  private readonly _router = inject(Router);
  private readonly _injector = inject(Injector);
  private readonly _isBrowser = inject(IS_BROWSER_PLATFORM);
  private readonly _window = inject(WINDOW)
  private readonly _dynamicComponents = inject(DynamicComponentsStore);
  private readonly _mediatr = inject(Mediatr);
  private readonly _viewContainerRef = inject(ViewContainerRef);
  private readonly _scrollableContainer = inject(SCROLLABLE_CONTAINER, { optional: true });

  public ngOnInit(): void {
    this._setupValueEffect();
  }

  private _setupValueEffect(): void {
    effect(
      onCleanup => {
        const html = this.value();
        if (!this._isBrowser || html == null) return;

        this._resetScroll();

        const ref = this._schedulePostRenderWork();
        onCleanup(() => ref.destroy());
      },
      { injector: this._injector },
    );
  }

  private _resetScroll(): void {
    this._scrollableContainer?.htmlElement?.scrollTo({ top: 0, left: 0 });
  }

  private _schedulePostRenderWork() {
    return afterNextRender(() => {
      return untracked(() => {
        this._renderDynamicComponents();
        this._recalculateToc();
      });
    }, { injector: this._injector });
  }

  private _renderDynamicComponents(): void {
    this._mediatr.execute(
      new RenderInternalComponentsRequest(this._hostElement, this._viewContainerRef),
    );
  }

  private _recalculateToc(): void {
    this._mediatr.execute(
      new CalculateTableOfContentRequest(this._hostElement),
    );
  }

  @HostListener('click', ['$event'])
  protected _onDocumentClick(event: MouseEvent): void {
    new HandleNavigationLinksHandler().handle(
      new HandleNavigationLinksRequest(event, this._window, this._router),
    );
  }

  public ngOnDestroy(): void {
    this._dynamicComponents.dispose();
  }
}
