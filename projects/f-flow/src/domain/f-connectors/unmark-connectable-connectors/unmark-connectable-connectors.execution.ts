import { UnmarkConnectableConnectorsRequest } from './unmark-connectable-connectors.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FConnectorBase } from '../../../f-connectors';
import { F_CSS_CLASS } from '../../css-cls';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(UnmarkConnectableConnectorsRequest)
export class UnmarkConnectableConnectorsExecution
  implements IExecution<UnmarkConnectableConnectorsRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(payload: UnmarkConnectableConnectorsRequest): void {
    this._store.flowHost.classList.remove(F_CSS_CLASS.DRAG_AND_DROP.CONNECTIONS_DRAGGING);
    payload.fConnectors.forEach((fConnector) => this._unmarkConnector(fConnector));
  }

  private _unmarkConnector(fConnector: FConnectorBase): void {
    fConnector.hostElement.classList.remove(F_CSS_CLASS.CONNECTOR.CONNECTABLE);
  }
}
