import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { F_LOCAL_STORAGE } from '@foblex/platform';
import { setCookieConsent } from '../../common-services';
import { F_ACCEPT_COOKIES_KEY } from '../../common-services';

declare const window: Window & typeof globalThis & { gtag?: Function };

@Component({
  selector: 'f-cookie-popup',
  standalone: true,
  templateUrl: './f-cookie-popup.component.html',
  styleUrls: [ './f-cookie-popup.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookiePopup {

  private readonly fLocalStorage = inject(F_LOCAL_STORAGE);

  public hasAccepted = signal<boolean>(false);

  constructor() {
    try {
      this.hasAccepted.set(this.fLocalStorage?.getItem(F_ACCEPT_COOKIES_KEY) === 'true');
    } catch {
      this.hasAccepted.set(false);
    }
  }

  protected accept(): void {
    try {
      this.fLocalStorage?.setItem(F_ACCEPT_COOKIES_KEY, 'true');
    } catch {
    }

    this.hasAccepted.set(true);
    setCookieConsent('granted');
  }
}
