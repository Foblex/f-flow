import { inject, InjectionToken } from '@angular/core';

import { WINDOW } from './window';

export const LOCAL_STORAGE = new InjectionToken<Storage>('F_LOCAL_STORAGE', {
  factory: () => inject(WINDOW).localStorage,
});
