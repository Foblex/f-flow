import { InjectionToken } from '@angular/core';

/**
 * Present (and `true`) when `withInitialView()` is registered through
 * `provideFFlow(...)` — the flow stays invisible until the first full render
 * and the viewport work queued by the `(fFullRendered)` handler have landed.
 */
export const F_INITIAL_VIEW = new InjectionToken<boolean>('F_INITIAL_VIEW');
