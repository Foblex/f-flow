import { CalculateTargetConnectorsToConnectRequest } from './calculate-target-connectors-to-connect-request';
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
import { CalculateConnectableSideByConnectedPositionsRequest, isCalculateMode } from '../../f-node';
import { IPoint } from '@foblex/2d';
import { EFConnectableSide } from '../../../f-connection-v2';

/**
 * Execution that retrieves all input connectors that can be connected to a given output or outlet connector,
 */
@Injectable()
@FExecutionRegister(CalculateTargetConnectorsToConnectRequest)
export class CalculateTargetConnectorsToConnect
  implements IExecution<CalculateTargetConnectorsToConnectRequest, IConnectorAndRect[]>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  private get _targetConnectors(): FConnectorBase[] {
    return this._store.fInputs;
  }

  public handle({
    sourceConnector,
    pointerPosition,
  }: CalculateTargetConnectorsToConnectRequest): IConnectorAndRect[] {
    const result = this._getCanBeConnectedInputs(sourceConnector).map((x) => {
      return this._mediator.execute<IConnectorAndRect>(new GetConnectorAndRectRequest(x));
    });

    setTimeout(() => {
      this._calculateConnectableSides(result, pointerPosition);
    });

    return result;
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

  private _calculateConnectableSides(
    connectors: IConnectorAndRect[],
    pointerPosition: IPoint,
  ): void {
    connectors.forEach((x) => {
      if (isCalculateMode(x.fConnector.userFConnectableSide)) {
        x.fConnector.fConnectableSide = this._calculateByConnectedPositions(
          x.fConnector,
          pointerPosition,
        );
      }
    });
  }

  /** Delegates to the connected-positions calculation execution. */
  private _calculateByConnectedPositions(
    connector: FConnectorBase,
    pointerPosition: IPoint,
  ): EFConnectableSide {
    return this._mediator.execute(
      new CalculateConnectableSideByConnectedPositionsRequest(connector, pointerPosition),
    );
  }
}
