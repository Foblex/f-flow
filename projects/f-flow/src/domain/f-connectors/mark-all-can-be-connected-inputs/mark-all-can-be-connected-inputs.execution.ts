import { MarkAllCanBeConnectedInputsRequest } from './mark-all-can-be-connected-inputs.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FConnectorBase } from '../../../f-connectors';
import { F_CSS_CLASS } from '../../css-cls';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(MarkAllCanBeConnectedInputsRequest)
export class MarkAllCanBeConnectedInputsExecution
  implements IExecution<MarkAllCanBeConnectedInputsRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(payload: MarkAllCanBeConnectedInputsRequest): void {
    this._store.flowHost.classList.add(F_CSS_CLASS.DRAG_AND_DROP.CONNECTIONS_DRAGGING);
    payload.fConnectors.forEach((fConnector) => this._markCanBeConnectedTo(fConnector));
  }

  private _markCanBeConnectedTo(fConnector: FConnectorBase): void {
    fConnector.hostElement.classList.add(F_CSS_CLASS.CONNECTOR.CONNECTABLE);
  }
}
