import { InjectionToken } from '@angular/core';

export const F_ZOOM = new InjectionToken<FZoomBase>('F_ZOOM');

export abstract class FZoomBase {

  public abstract minimum: number;

  public abstract maximum: number;

  public abstract step: number;

  public abstract dblClickStep: number;
}
