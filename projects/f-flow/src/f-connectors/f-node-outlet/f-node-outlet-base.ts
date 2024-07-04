import { Directive, InjectionToken } from '@angular/core';
import { FConnectorBase } from '../f-connector-base';

export const F_NODE_OUTLET = new InjectionToken<FNodeOutletBase>('F_NODE_OUTLET');

@Directive()
export abstract class FNodeOutletBase extends FConnectorBase {

  public abstract isConnectionFromOutlet: boolean;

  public override isConnected: boolean = false;

  private outputs: FConnectorBase[] = [];

  public get canBeConnected(): boolean {
    return !this.disabled && this.outputs.some((output) => output.canBeConnected);
  }

  public setOutputs(outputs: FConnectorBase[]): void {
    this.outputs = outputs;
  }
}
