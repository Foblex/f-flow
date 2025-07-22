import { MarkConnectableConnectorsRequest } from './mark-connectable-connectors.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FConnectorBase } from '../../../f-connectors';
import { F_CSS_CLASS } from '../../css-cls';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(MarkConnectableConnectorsRequest)
export class MarkConnectableConnectorsExecution
  implements IExecution<MarkConnectableConnectorsRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(payload: MarkConnectableConnectorsRequest): void {
    this._store.flowHost.classList.add(F_CSS_CLASS.DRAG_AND_DROP.CONNECTIONS_DRAGGING);
    payload.fConnectors.forEach((fConnector) => this._markConnector(fConnector));
  }

  private _markConnector(fConnector: FConnectorBase): void {
    fConnector.hostElement.classList.add(F_CSS_CLASS.CONNECTOR.CONNECTABLE);
  }
}
