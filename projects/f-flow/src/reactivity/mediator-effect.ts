import { CreateEffectOptions, effect } from '@angular/core';
import { FMediator } from '@foblex/mediator';

export function mediatorEffect(fn: () => any, options?: CreateEffectOptions) {
  let isFirstRun = true;

  return effect(() => {
    const request = fn();
    if (isFirstRun) {
      isFirstRun = false;
      return;
    }
    options?.injector?.get(FMediator).execute(request);
  }, options);
}
