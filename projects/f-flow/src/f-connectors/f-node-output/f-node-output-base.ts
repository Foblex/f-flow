import { Directive, InjectionToken, Signal } from '@angular/core';
import { FConnectorBase } from '../f-connector-base';

export const F_NODE_OUTPUT = new InjectionToken<FNodeOutputBase>('F_NODE_OUTPUT');

@Directive()
export abstract class FNodeOutputBase extends FConnectorBase {
  public abstract multiple: Signal<boolean>;

  public override get canBeConnected(): boolean {
    return !this.disabled() && (this.multiple() ? true : !this.isConnected);
  }

  public abstract canBeConnectedInputs: string[];
}
