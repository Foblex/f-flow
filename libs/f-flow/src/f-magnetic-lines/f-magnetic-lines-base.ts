import { Directive, ElementRef, inject, InjectionToken, Signal } from '@angular/core';

export const F_MAGNETIC_LINES = new InjectionToken<FMagneticLinesBase>('F_MAGNETIC_LINES');

@Directive()
export abstract class FMagneticLinesBase {
  public readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;
  public abstract threshold: Signal<number>;
}
