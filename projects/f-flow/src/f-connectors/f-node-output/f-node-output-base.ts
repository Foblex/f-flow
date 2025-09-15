import { Directive, InjectionToken, Signal } from '@angular/core';
import { FSourceConnectorBase } from '../f-source-connector-base';

export const F_NODE_OUTPUT = new InjectionToken<FNodeOutputBase>('F_NODE_OUTPUT');

@Directive()
export abstract class FNodeOutputBase extends FSourceConnectorBase {
  public abstract multiple: Signal<boolean>;

  public override get canBeConnected(): boolean {
    return !this.disabled() && (this.multiple() ? true : !this.isConnected);
  }
}
