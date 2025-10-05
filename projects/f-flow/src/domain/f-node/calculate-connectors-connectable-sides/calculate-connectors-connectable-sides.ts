import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CalculateConnectorsConnectableSidesRequest } from './calculate-connectors-connectable-sides-request';
import { EFConnectableSide, FConnectorBase } from '../../../f-connectors';
import { CalculateConnectableSideByConnectedPositionsRequest } from './calculate-connectable-side-by-connected-positions';
import { CalculateConnectableSideByInternalPositionRequest } from './calculate-connectable-side-by-internal-position';
import { isCalculateMode } from './utils';

/**
 * Execution that calculates connectable sides for all connectors of a node.
 */
@Injectable()
@FExecutionRegister(CalculateConnectorsConnectableSidesRequest)
export class CalculateConnectorsConnectableSides
  implements IExecution<CalculateConnectorsConnectableSidesRequest, void>
{
  private readonly _mediator = inject(FMediator);

  /**
   * Orchestrates side calculation for all connectors of the given node.
   */
  public handle({ nodeOrGroup }: CalculateConnectorsConnectableSidesRequest): void {
    const connectors = nodeOrGroup.connectors;
    const len = connectors.length;

    for (let i = 0; i < len; i++) {
      const connection = connectors[i];
      connection.fConnectableSide = this._resolveSideForConnectorFast(connection);
    }

    const toRecalc = new Set<FConnectorBase>();

    for (let i = 0; i < len; i++) {
      const source = connectors[i];
      const outs = source.toConnector;
      if (outs && outs.length) {
        for (let j = 0, m = outs.length; j < m; j++) {
          const target = outs[j];
          const userSide = target.userFConnectableSide;
          if (isCalculateMode(userSide)) {
            toRecalc.add(target);
          }
        }
      }
    }

    if (toRecalc.size > 0) {
      toRecalc.forEach((target) => {
        target.fConnectableSide = this._calculateByConnectedPositions(target);
      });
    }
  }

  /**
   * Resolves the connectable side for a connector quickly.
   * Avoids intermediate arrays and redundant allocations.
   */
  private _resolveSideForConnectorFast(connector: FConnectorBase): EFConnectableSide {
    const mode = connector.userFConnectableSide;

    if (mode === EFConnectableSide.AUTO) {
      return this._mediator.execute<EFConnectableSide>(
        new CalculateConnectableSideByInternalPositionRequest(connector),
      );
    }

    if (isCalculateMode(mode)) {
      return this._calculateByConnectedPositions(connector);
    }

    return mode;
  }

  /** Delegates to the connected-positions calculation execution. */
  private _calculateByConnectedPositions(connector: FConnectorBase): EFConnectableSide {
    return this._mediator.execute(
      new CalculateConnectableSideByConnectedPositionsRequest(connector),
    );
  }
}
