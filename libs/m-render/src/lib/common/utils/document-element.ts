import { inject, InjectionToken } from '@angular/core';

import { DOCUMENT } from '@angular/common';

export const DOCUMENT_ELEMENT = new InjectionToken<HTMLElement>('DOCUMENT_ELEMENT', {
  factory: () => inject(DOCUMENT).documentElement,
});
