import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const IS_BROWSER_PLATFORM = new InjectionToken<boolean>('IS_BROWSER_PLATFORM', {
  factory() {
    return isPlatformBrowser(inject(PLATFORM_ID));
  },
});
