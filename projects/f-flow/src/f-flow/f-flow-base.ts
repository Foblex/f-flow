import {
  InjectionToken,
  InputSignal,
  InputSignalWithTransform,
  OutputEmitterRef,
} from '@angular/core';
import { IHasHostElement } from '../i-has-host-element';
import type { IFFlowState, IFFlowStateOptions } from '../domain';

export const F_FLOW = new InjectionToken<FFlowBase>('F_FLOW');

export abstract class FFlowBase implements IHasHostElement {
  public abstract fId: InputSignal<string>;
  public abstract fCache: InputSignalWithTransform<boolean, unknown>;

  public abstract hostElement: HTMLElement;

  public abstract fLoaded: OutputEmitterRef<string>;

  public abstract redraw(): void;

  public abstract getState(options?: IFFlowStateOptions): IFFlowState;
}
