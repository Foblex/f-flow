import { inject, InjectionToken } from '@angular/core';

import { WINDOW } from './window';

export const LOCATION = new InjectionToken<Location>('F_LOCATION', {
  factory: () => inject(WINDOW).location,
});
