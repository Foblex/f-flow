import { GetAllCanBeConnectedInputsAndRectsRequest } from './get-all-can-be-connected-inputs-and-rects.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import {
  FConnectorBase,
  FNodeInputBase,
  FNodeOutletBase,
  FNodeOutputBase,
} from '../../../f-connectors';
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
  private readonly _store = inject(FComponentsStore);

  private get _targetConnectors(): FConnectorBase[] {
    return this._store.fInputs;
  }

  public handle({
    outputOrOutlet,
  }: GetAllCanBeConnectedInputsAndRectsRequest): IConnectorAndRect[] {
    return this._getCanBeConnectedInputs(outputOrOutlet).map((x) => {
      return this._mediator.execute(new GetConnectorAndRectRequest(x));
    });
  }

  private _getCanBeConnectedInputs(
    outputOrOutlet: FNodeOutputBase | FNodeOutletBase,
  ): FConnectorBase[] {
    let targetConnectors: FConnectorBase[] = [];
    if (outputOrOutlet.hasConnectionLimits) {
      targetConnectors = this._targetConnectors.filter((x) =>
        outputOrOutlet.canConnectTo(x as FNodeInputBase),
      );
    } else {
      targetConnectors = this._targetConnectors.filter((x) => x.canBeConnected);

      if (!outputOrOutlet.isSelfConnectable) {
        targetConnectors = this._filterSelfConnectable(targetConnectors, outputOrOutlet);
      }
    }

    return targetConnectors;
  }

  private _filterSelfConnectable(
    targetConnectors: FConnectorBase[],
    outputOrOutlet: FConnectorBase,
  ): FConnectorBase[] {
    return targetConnectors.filter(({ fNodeId }) => outputOrOutlet.fNodeId !== fNodeId);
  }
}
