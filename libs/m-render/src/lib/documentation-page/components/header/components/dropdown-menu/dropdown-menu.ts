import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition, Overlay } from '@angular/cdk/overlay';
import { ThemeButtonComponent } from '../../../../../theme';
import { HeaderMenuBase } from '../../models';
import { RouterLink } from '@angular/router';
import { MediaLinks } from '../media-links';

@Component({
  selector: 'dropdown-menu',
  templateUrl: './dropdown-menu.html',
  styleUrls: ['./dropdown-menu.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    ThemeButtonComponent,
    RouterLink,
    MediaLinks,
  ],
})
export class DropdownMenu extends HeaderMenuBase implements OnDestroy {
  protected readonly isOpen = signal(false);
  protected readonly scrollStrategy = inject(Overlay).scrollStrategies.block();
  protected readonly positions: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
    },
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
    },
  ];

  private _hoverTimeout: any | undefined;

  protected mouseEnter(): void {
    clearTimeout(this._hoverTimeout);
    this.open();
  }

  protected mouseLeave(): void {
    clearTimeout(this._hoverTimeout);
    this._hoverTimeout = setTimeout(() => this.close(), 200);
  }

  protected toggle(): void {
    this.isOpen.update(x => !x);
  }

  protected open(): void {
    if (!this.isOpen()) {
      this.isOpen.set(true);
    }
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  public ngOnDestroy(): void {
    clearTimeout(this._hoverTimeout);
  }
}
