import { inject, Injectable } from '@angular/core';
import { F_LOCAL_STORAGE } from '@foblex/platform';
import { setCookieConsent } from './set-cookie-consent';
import { F_ACCEPT_COOKIES_KEY } from './f-accept-cookies-key';
import { IWindowWithAnalytics } from './i-window-with-analytics';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class FAnalyticsService {

  private readonly fLocalStorage = inject(F_LOCAL_STORAGE);

  private readonly document = inject(DOCUMENT);

  public initialize(analyticsId: string): void {
    this.installGlobalSiteTag(analyticsId);
  }

  private installGlobalSiteTag(analyticsId: string) {
    const window = this.document.defaultView as unknown as IWindowWithAnalytics;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };

    if (this.fLocalStorage) {
      if (this.fLocalStorage.getItem(F_ACCEPT_COOKIES_KEY) === 'true') {
        setCookieConsent('granted');
      } else {
        setCookieConsent('denied');
      }
    } else {
      setCookieConsent('denied');
    }

    window.gtag('js', new Date());

    window.gtag('config', analyticsId);

    if (this.document.querySelector('#gtag-script') === null) {
      this.document.head.appendChild(this.getGtmScript(analyticsId));
    }
  }

  private getGtmScript(analyticsId: string): HTMLScriptElement {
    const gtmScript = this.document.createElement('script');
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtag/js?id=${ analyticsId }`;
    gtmScript.id = 'gtag-script';
    return gtmScript;
  }
}
