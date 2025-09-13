import { MarkConnectableConnectorsRequest } from './mark-connectable-connectors-request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FConnectorBase } from '../../../f-connectors';
import { F_CSS_CLASS } from '../../css-cls';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that marks connectors as connectable.
 */
@Injectable()
@FExecutionRegister(MarkConnectableConnectorsRequest)
export class MarkConnectableConnectors
  implements IExecution<MarkConnectableConnectorsRequest, void>
{
  private readonly _store = inject(FComponentsStore);

  public handle({ connectors }: MarkConnectableConnectorsRequest): void {
    this._store.flowHost.classList.add(F_CSS_CLASS.DRAG_AND_DROP.CONNECTIONS_DRAGGING);
    connectors.forEach((x) => this._markConnector(x));
  }

  private _markConnector({ hostElement }: FConnectorBase): void {
    hostElement.classList.add(F_CSS_CLASS.CONNECTOR.CONNECTABLE);
  }
}
