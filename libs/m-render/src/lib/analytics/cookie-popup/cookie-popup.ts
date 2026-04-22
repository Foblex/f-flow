import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GTagService } from '../g-tag.service';
import { LOCAL_STORAGE } from '../../common';

export const F_ACCEPT_COOKIES_KEY = 'm-accepts-cookies';

@Component({
  selector: 'cookie-popup',
  standalone: true,
  templateUrl: './cookie-popup.html',
  styleUrls: ['./cookie-popup.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookiePopup {
  private readonly _localStorage = inject(LOCAL_STORAGE);
  private readonly _gtag = inject(GTagService, { optional: true });

  private readonly _consentValue = signal<string | null>(null);

  protected readonly showPopup = computed(() =>
    this._gtag !== null &&
    this._consentValue() !== 'true' &&
    this._consentValue() !== 'false',
  );

  constructor() {
    try {
      const value = this._localStorage?.getItem(F_ACCEPT_COOKIES_KEY);
      this._consentValue.set(value);
    } catch {
      this._consentValue.set(null);
    }
  }

  protected accept(): void {
    try {
      this._localStorage?.setItem(F_ACCEPT_COOKIES_KEY, 'true');
    } catch { /* empty */ }

    this._gtag?.updateConsent(true);
    this._consentValue.set('true');
  }
}

