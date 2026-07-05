import { FConnectorBase } from './f-connector-base';
import { Directive } from '@angular/core';

@Directive()
export abstract class FSourceConnectorBase extends FConnectorBase {
  public abstract canBeConnectedInputs: string[];

  public get hasConnectionLimits(): boolean {
    return !!this.canBeConnectedInputs && this.canBeConnectedInputs.length > 0;
  }

  public canConnectTo(targetConnector: FConnectorBase): boolean {
    const candidates = [targetConnector.fId(), targetConnector.category?.()];

    return candidates.some((c) => c && this.canBeConnectedInputs?.includes(c));
  }
}
