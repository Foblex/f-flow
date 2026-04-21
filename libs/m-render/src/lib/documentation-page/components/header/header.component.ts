import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { HamburgerButton } from './components/hamburger-button';
import { DocumentationStore } from '../../services';
import { ThemeButtonComponent } from '../../../theme';
import { InlineMenu } from './components/inline-menu';
import { MediaLinks } from './components/media-links';
import { DropdownMenu } from './components/dropdown-menu';
import { HEADER_CONFIGURATION_PROVIDER } from '../../../common';
import { FBrandLinkComponent, FSearchButtonComponent } from '../../../shared';

@Component({
  selector: 'f-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HamburgerButton,
    FBrandLinkComponent,
    FSearchButtonComponent,
    ThemeButtonComponent,
    InlineMenu,
    DropdownMenu,
    MediaLinks,
  ],
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  protected title = inject(DocumentationStore).getTitle();
  protected image = inject(DocumentationStore).getLogo();
  protected config = inject(HEADER_CONFIGURATION_PROVIDER);

  protected readonly emptyNavigation = !inject(DocumentationStore).getNavigation().length;

  private readonly _zone = inject(NgZone);

  private readonly _containerRef = viewChild.required<ElementRef<HTMLElement>>('container');
  private readonly _targetRef = viewChild.required<ElementRef<HTMLElement>>('target');

  protected readonly overflowed = signal(false);
  protected readonly initialized = signal(false);

  private _rafId: number | null = null;
  private _roContainer?: ResizeObserver;
  private _roTarget?: ResizeObserver;

  public ngAfterViewInit(): void {
    if (typeof ResizeObserver === 'undefined') {
      this._checkOverflow(true);
      return;
    }
    this._initObservers();
    this._checkOverflow(true); // первый замер синхронно
  }

  private _initObservers(): void {
    const container = this._containerRef().nativeElement;
    const target = this._targetRef().nativeElement;

    this._zone.runOutsideAngular(() => {
      const cb = () => this._scheduleCheck();
      this._roContainer = new ResizeObserver(cb);
      this._roTarget = new ResizeObserver(cb);

      this._roContainer.observe(container);
      this._roTarget.observe(target);
    });
  }

  private _scheduleCheck(): void {
    if (this._rafId != null) return;
    this._rafId = requestAnimationFrame(() => {
      this._rafId = null;
      this._checkOverflow(false);
    });
  }

  private _checkOverflow(isFirst: boolean): void {
    const container = this._containerRef().nativeElement;
    const target = this._targetRef().nativeElement;
    if (!container || !target) return;

    const next = target.scrollWidth >= container.clientWidth;

    if (next !== this.overflowed() || !this.initialized()) {
      this._zone.run(() => {
        this.overflowed.set(next);
        if (isFirst) this.initialized.set(true);
      });
    }
  }

  public ngOnDestroy(): void {
    this._roContainer?.disconnect();
    this._roTarget?.disconnect();
    if (this._rafId != null) cancelAnimationFrame(this._rafId);
  }
}
