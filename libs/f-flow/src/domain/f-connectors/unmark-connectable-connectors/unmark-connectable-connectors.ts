import { UnmarkConnectableConnectorsRequest } from './unmark-connectable-connectors-request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FConnectorBase } from '../../../f-connectors';
import { F_CSS_CLASS } from '../../css-cls';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that unmarks connectors as connectable.
 */
@Injectable()
@FExecutionRegister(UnmarkConnectableConnectorsRequest)
export class UnmarkConnectableConnectors
  implements IExecution<UnmarkConnectableConnectorsRequest, void>
{
  private readonly _store = inject(FComponentsStore);

  public handle({ connectors }: UnmarkConnectableConnectorsRequest): void {
    this._store.flowHost.classList.remove(F_CSS_CLASS.DRAG_AND_DROP.CONNECTIONS_DRAGGING);
    connectors.forEach((x) => this._unmarkConnector(x));
  }

  private _unmarkConnector({ hostElement }: FConnectorBase): void {
    hostElement.classList.remove(F_CSS_CLASS.CONNECTOR.CONNECTABLE);
  }
}
