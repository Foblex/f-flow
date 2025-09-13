import { Directive, InjectionToken } from '@angular/core';
import { FConnectorBase } from '../f-connector-base';
import { FSourceConnectorBase } from '../f-source-connector-base';

export const F_NODE_OUTLET = new InjectionToken<FNodeOutletBase>('F_NODE_OUTLET');

@Directive()
export abstract class FNodeOutletBase extends FSourceConnectorBase {
  public abstract isConnectionFromOutlet: boolean;

  private _outputs: FConnectorBase[] = [];

  public get canBeConnected(): boolean {
    return !this.disabled() && this._outputs.some((output) => output.canBeConnected);
  }

  public setOutputs(outputs: FConnectorBase[]): void {
    this._outputs = outputs;
  }
}
