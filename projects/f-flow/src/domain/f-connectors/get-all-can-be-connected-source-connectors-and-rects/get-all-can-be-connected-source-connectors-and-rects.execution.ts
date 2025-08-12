import {
  GetAllCanBeConnectedSourceConnectorsAndRectsRequest
} from './get-all-can-be-connected-source-connectors-and-rects.request';
import {inject, Injectable} from '@angular/core';
import {FExecutionRegister, FMediator, IExecution} from '@foblex/mediator';
import {FConnectorBase, FNodeInputBase, FNodeOutputBase} from '../../../f-connectors';
import {FComponentsStore} from '../../../f-storage';
import {IConnectorAndRect} from '../i-connector-and-rect';
import {GetConnectorAndRectRequest} from '../get-connector-and-rect';

/**
 * Execution that retrieves all source connectors that can be connected to a given target connector,
 * along with their rectangles.
 * Source - Output or Outlet connectors.
 */
@Injectable()
@FExecutionRegister(GetAllCanBeConnectedSourceConnectorsAndRectsRequest)
export class GetAllCanBeConnectedSourceConnectorsAndRectsExecution
  implements IExecution<GetAllCanBeConnectedSourceConnectorsAndRectsRequest, IConnectorAndRect[]> {

  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  private get _fSourceConnectors(): FNodeOutputBase[] {
    return this._store.fOutputs as FNodeOutputBase[];
  }

  public handle(payload: GetAllCanBeConnectedSourceConnectorsAndRectsRequest): IConnectorAndRect[] {
    return this._getCanBeConnectedSourceConnectors(payload.fTargetConnector).map((x) => {
      return this._mediator.execute(new GetConnectorAndRectRequest(x));
    });
  }

  private _getCanBeConnectedSourceConnectors(fTargetConnector: FNodeInputBase): FConnectorBase[] {
    return this._fSourceConnectors.filter((x) => {
      let result = x.canBeConnected;
      if (result && x.canBeConnectedInputs?.length) {
        result = x.canBeConnectedInputs?.includes(fTargetConnector.fId);
      }

      return result;
    });
  }
}
