import { InjectionToken, Signal } from '@angular/core';

export const F_CONNECTION_GRADIENT = new InjectionToken<FConnectionGradientBase>(
  'F_CONNECTION_GRADIENT',
);

export abstract class FConnectionGradientBase {
  public abstract fStartColor: Signal<string>;
  public abstract fEndColor: Signal<string>;
}
