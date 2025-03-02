import { InjectionToken, InputSignal, OutputEmitterRef } from '@angular/core';
import { IHasHostElement } from '../i-has-host-element';

export const F_FLOW = new InjectionToken<FFlowBase>('F_FLOW');

export abstract class FFlowBase implements IHasHostElement {

  public abstract fId: InputSignal<string>;

  public abstract hostElement: HTMLElement;

  public abstract fLoaded: OutputEmitterRef<void>;
}
