import { UnmarkAllCanBeConnectedInputsRequest } from './unmark-all-can-be-connected-inputs.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FConnectorBase } from '../../../f-connectors';
import { F_CSS_CLASS } from '../../css-cls';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(UnmarkAllCanBeConnectedInputsRequest)
export class UnmarkAllCanBeConnectedInputsExecution
  implements IExecution<UnmarkAllCanBeConnectedInputsRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(payload: UnmarkAllCanBeConnectedInputsRequest): void {
    this._store.flowHost.classList.remove(F_CSS_CLASS.DRAG_AND_DROP.CONNECTIONS_DRAGGING);
    payload.fConnectors.forEach((fConnector) => this._unmarkCanBeConnectedTo(fConnector));
  }

  private _unmarkCanBeConnectedTo(fConnector: FConnectorBase): void {
    fConnector.hostElement.classList.remove(F_CSS_CLASS.CONNECTOR.CONNECTABLE);
  }
}
