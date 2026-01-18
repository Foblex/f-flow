import { ILine } from '@foblex/2d';
import { ElementRef, inject, InjectionToken } from '@angular/core';

export const F_CONNECTION_GRADIENT = new InjectionToken<FConnectionGradientBase>(
  'F_CONNECTION_GRADIENT',
);

export abstract class FConnectionGradientBase {
  public readonly hostElement = inject(ElementRef<SVGLinearGradientElement>).nativeElement;

  public abstract initialize(): void;

  public abstract redraw(line: ILine): void;
}
