import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserLocalStorageService } from './browser-local-storage.service';
import { ServerLocalStorageService } from './server-local-storage.service';
import { ILocalStorage } from './i-local-storage';

/**
 * @deprecated Not used by `@foblex/flow`; scheduled for removal in v20.
 */
export const F_LOCAL_STORAGE = new InjectionToken<ILocalStorage>('F_LOCAL_STORAGE', {
  providedIn: 'root',
  factory: () => {
    return isPlatformBrowser(inject(PLATFORM_ID))
      ? inject(BrowserLocalStorageService)
      : inject(ServerLocalStorageService);
  },
});
