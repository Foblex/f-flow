import { Directive, InjectionToken } from '@angular/core';
import { FConnectorBase } from '../f-connector-base';

export const F_NODE_OUTPUT = new InjectionToken<FNodeOutputBase>('F_NODE_OUTPUT');

@Directive()
export abstract class FNodeOutputBase extends FConnectorBase {

  public abstract multiple: boolean;

  public isConnected: boolean = false;

  public override get canBeConnected(): boolean {
    return !this.disabled && (this.multiple ? true : !this.isConnected);
  }
}
