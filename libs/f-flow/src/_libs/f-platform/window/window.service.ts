import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { IWindowService } from './i-window-service';
import { isPlatformBrowser } from '@angular/common';
import { BrowserWindowService } from './browser-window.service';
import { ServerWindowService } from './server-window.service';

export const F_WINDOW = new InjectionToken<IWindowService>('F_WINDOW', {
  providedIn: 'root',
  factory: () => {
    return isPlatformBrowser(inject(PLATFORM_ID))
      ? inject(BrowserWindowService)
      : inject(ServerWindowService);
  },
});
