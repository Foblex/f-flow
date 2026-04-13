import { ElementRef, inject, InjectionToken, signal } from '@angular/core';
import { EFMarkerType } from '../enums';

export const F_CONNECTION_MARKER = new InjectionToken<FConnectionMarkerBase>('F_CONNECTION_MARKER');

let uniqueId = 0;

export abstract class FConnectionMarkerBase {
  public readonly fId = signal<string>(`f-marker-${uniqueId++}`);

  public readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;

  public abstract markerElement: SVGElement;

  public abstract width: number;

  public abstract height: number;

  public abstract refX: number;

  public abstract refY: number;

  public abstract get type(): EFMarkerType;

  public abstract orient: 'auto' | 'auto-start-reverse' | string;

  public abstract markerUnits: 'strokeWidth' | 'userSpaceOnUse';
}
