import { GetAllCanBeConnectedInputsAndRectsRequest } from './get-all-can-be-connected-inputs-and-rects.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FConnectorBase, FNodeOutletBase, FNodeOutputBase } from '../../../f-connectors';
import { FComponentsStore } from '../../../f-storage';
import { IConnectorAndRect } from '../i-connector-and-rect';
import { GetConnectorAndRectRequest } from '../get-connector-and-rect';

/**
 * Execution that retrieves all input connectors that can be connected to a given output or outlet connector,
 */
@Injectable()
@FExecutionRegister(GetAllCanBeConnectedInputsAndRectsRequest)
export class GetAllCanBeConnectedInputsAndRectsExecution
  implements IExecution<GetAllCanBeConnectedInputsAndRectsRequest, IConnectorAndRect[]>
{
  private readonly _mediator = inject(FMediator);
  private _store = inject(FComponentsStore);

  private get _fInputs(): FConnectorBase[] {
    return this._store.fInputs;
  }

  public handle(payload: GetAllCanBeConnectedInputsAndRectsRequest): IConnectorAndRect[] {
    return this._getCanBeConnectedInputs(payload.fOutputOrOutlet).map((x) => {
      return this._mediator.execute(new GetConnectorAndRectRequest(x));
    });
  }

  private _getCanBeConnectedInputs(
    fOutputOrOutlet: FNodeOutputBase | FNodeOutletBase,
  ): FConnectorBase[] {
    let fInputs: FConnectorBase[] = [];
    if (fOutputOrOutlet.canBeConnectedInputs?.length) {
      fInputs = this._fInputs.filter((x) => fOutputOrOutlet.canBeConnectedInputs.includes(x.fId()));
    } else {
      fInputs = this._fInputs.filter((x) => x.canBeConnected);

      if (!fOutputOrOutlet.isSelfConnectable) {
        fInputs = this._filterSelfConnectable(fInputs, fOutputOrOutlet);
      }
    }

    return fInputs;
  }

  private _filterSelfConnectable(
    fInputs: FConnectorBase[],
    fOutputOrOutlet: FConnectorBase,
  ): FConnectorBase[] {
    return fInputs.filter((x) => fOutputOrOutlet.fNodeId !== x.fNodeId);
  }
}
