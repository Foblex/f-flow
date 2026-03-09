import { Directive, ElementRef, inject, InjectionToken } from '@angular/core';
import { FMinimapState } from '../domain';

export const F_MINIMAP_BASE = new InjectionToken<FMinimapBase>('F_MINIMAP_BASE');

@Directive()
export abstract class FMinimapBase {
  public readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;

  public abstract state: FMinimapState;
}
