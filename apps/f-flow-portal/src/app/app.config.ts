import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
  Injectable,
  PLATFORM_ID,
  Provider,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { F_ACCEPT_COOKIES_KEY, GTagService, provideGTag, provideTheme } from '@foblex/m-render';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_SELECT_CONFIG } from '@angular/material/select';

@Injectable()
export class ClientErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    console.error('[ClientErrorHandler]', error);
  }
}

/**
 * Patches a bug in @foblex/m-render's CookiePopup: on returning visits its
 * constructor reads localStorage and hides the banner, but never calls
 * updateConsent(true). That leaves gtag stuck in 'denied' consent state, so
 * GA4 / Ads receive no data from users who accepted cookies in a prior
 * session — i.e. everyone except first-time visitors.
 *
 * We initialize GTagService at bootstrap and, if consent was granted
 * previously, replay the `consent: update` signal immediately.
 */
function provideReturningVisitorConsentBridge(): Provider {
  return {
    provide: APP_INITIALIZER,
    multi: true,
    useFactory: () => {
      const platformId = inject(PLATFORM_ID);
      const doc = inject(DOCUMENT);
      const gtag = inject(GTagService, { optional: true });

      return () => {
        if (!isPlatformBrowser(platformId) || !gtag) {
          return;
        }

        gtag.initialize();

        try {
          const accepted = doc.defaultView?.localStorage.getItem(F_ACCEPT_COOKIES_KEY) === 'true';
          if (accepted) {
            gtag.updateConsent(true);
          }
        } catch {
          // localStorage may be unavailable (privacy mode, Safari ITP, etc.).
        }
      };
    },
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideClientHydration(withEventReplay()),
    { provide: ErrorHandler, useClass: ClientErrorHandler },
    provideGTag({
      id: 'G-CEND4J0WYF',
      extraIds: ['AW-16677977117'],
      autoPageview: true,
    }),
    provideReturningVisitorConsentBridge(),
    provideTheme(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', subscriptSizing: 'dynamic' },
    },
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'example-select-panel', disableOptionCentering: true },
    },
  ],
};
