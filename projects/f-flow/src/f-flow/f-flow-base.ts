import { EventEmitter, InjectionToken } from '@angular/core';
import { IHasHostElement } from '@foblex/core';

export const F_FLOW = new InjectionToken<FFlowBase>('F_FLOW');

export abstract class FFlowBase implements IHasHostElement {

  public abstract fFlowId: string;

  public abstract hostElement: HTMLElement;

  public abstract fLoaded: EventEmitter<void>;
}
