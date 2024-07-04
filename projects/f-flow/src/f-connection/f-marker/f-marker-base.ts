import { Directive, InjectionToken } from '@angular/core';
import { IHasHostElement } from '@foblex/core';

export const F_MARKER = new InjectionToken('F_MARKER');

@Directive()
export abstract class FMarkerBase implements IHasHostElement {

  public abstract hostElement: HTMLElement;

  public abstract width: number;

  public abstract height: number;

  public abstract refX: number;

  public abstract refY: number;

  public abstract type: string;

  public abstract orient: 'auto' | 'auto-start-reverse' | string;

  public abstract markerUnits: 'strokeWidth' | 'userSpaceOnUse';
}
