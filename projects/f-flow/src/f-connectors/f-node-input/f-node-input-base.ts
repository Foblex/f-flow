import { Directive, InjectionToken, Signal } from '@angular/core';
import { FConnectorBase } from '../f-connector-base';

export const F_NODE_INPUT = new InjectionToken<FNodeInputBase>('F_NODE_INPUT');

@Directive()
export abstract class FNodeInputBase extends FConnectorBase {
  public abstract category: Signal<string | undefined>;

  public abstract multiple: Signal<boolean>;

  public get canBeConnected(): boolean {
    return !this.disabled() && (this.multiple() ? true : !this.isConnected);
  }
}
