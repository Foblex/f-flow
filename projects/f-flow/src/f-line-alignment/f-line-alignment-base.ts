import { Directive, ElementRef, inject, InjectionToken, Signal } from '@angular/core';

export const F_LINE_ALIGNMENT = new InjectionToken<FLineAlignmentBase>('F_LINE_ALIGNMENT');

@Directive()
export abstract class FLineAlignmentBase {
  public readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;
  public abstract fAlignThreshold: Signal<number>;
}
