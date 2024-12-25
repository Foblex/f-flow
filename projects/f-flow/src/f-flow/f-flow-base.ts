import { EventEmitter, InjectionToken } from '@angular/core';
import { IHasHostElement } from '../i-has-host-element';

export const F_FLOW = new InjectionToken<FFlowBase>('F_FLOW');

export abstract class FFlowBase implements IHasHostElement {

  public abstract fId: string;

  public abstract hostElement: HTMLElement;

  public abstract fLoaded: EventEmitter<void>;
}
