import { ElementRef, inject, InjectionToken } from '@angular/core';

export const F_CONNECTION_PATH = new InjectionToken<FConnectionPathBase>('F_CONNECTION_PATH');

export abstract class FConnectionPathBase {
  public readonly hostElement = inject(ElementRef<SVGPathElement>).nativeElement;

  public abstract initialize(): void;

  public abstract setPath(path: string): void;

  public abstract select(): void;

  public abstract deselect(): void;
}
