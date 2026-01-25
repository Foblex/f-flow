import { Directive, InjectionToken, Signal } from '@angular/core';

export const F_LINE_ALIGNMENT = new InjectionToken<FLineAlignmentBase>('F_LINE_ALIGNMENT');

@Directive()
export abstract class FLineAlignmentBase {
  public abstract hostElement: HTMLElement;
  public abstract fAlignThreshold: Signal<number>;
}
