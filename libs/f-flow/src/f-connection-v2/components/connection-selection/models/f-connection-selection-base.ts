import { ElementRef, inject, InjectionToken } from '@angular/core';

export const F_CONNECTION_SELECTION = new InjectionToken<FConnectionSelectionBase>(
  'F_CONNECTION_SELECTION',
);

export abstract class FConnectionSelectionBase {
  public readonly hostElement = inject(ElementRef<SVGPathElement>).nativeElement;

  public abstract setPath(path: string): void;
}
