import { CalculateSourceConnectorsToConnectRequest } from './calculate-source-connectors-to-connect-request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import {
  EFConnectableSide,
  FConnectorBase,
  FNodeInputBase,
  FNodeOutputBase,
} from '../../../f-connectors';
import { FComponentsStore } from '../../../f-storage';
import { IConnectorAndRect } from '../i-connector-and-rect';
import { GetConnectorAndRectRequest } from '../get-connector-and-rect';
import { IPoint } from '@foblex/2d';
import { CalculateConnectableSideByConnectedPositionsRequest, isCalculateMode } from '../../f-node';

/**
 * Execution that retrieves all source connectors that can be connected to a given target connector,
 * along with their rectangles.
 * Source - Output or Outlet connectors.
 */
@Injectable()
@FExecutionRegister(CalculateSourceConnectorsToConnectRequest)
export class CalculateSourceConnectorsToConnect
  implements IExecution<CalculateSourceConnectorsToConnectRequest, IConnectorAndRect[]>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  private get _sourceConnectors(): FNodeOutputBase[] {
    return this._store.fOutputs as FNodeOutputBase[];
  }

  public handle({
    targetConnector,
    pointerPosition,
  }: CalculateSourceConnectorsToConnectRequest): IConnectorAndRect[] {
    const result = this._getConnectableSources(targetConnector).map((x) => {
      return this._mediator.execute<IConnectorAndRect>(new GetConnectorAndRectRequest(x));
    });

    setTimeout(() => {
      this._calculateConnectableSides(result, pointerPosition);
    });

    return result;
  }

  private _getConnectableSources(targetConnector: FNodeInputBase): FConnectorBase[] {
    return this._sourceConnectors.filter((x) => {
      let result = x.canBeConnected;
      if (result && x.hasConnectionLimits) {
        result = x.canConnectTo(targetConnector);
      }

      return result;
    });
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
