import { Directive, ElementRef, inject, InjectionToken, Signal } from '@angular/core';

export const F_MAGNETIC_RECTS = new InjectionToken<FMagneticRectsBase>('F_MAGNETIC_RECTS');

@Directive()
export abstract class FMagneticRectsBase {
  public readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;
  public abstract alignThreshold: Signal<number>;
  public abstract spacingThreshold: Signal<number>;
}
