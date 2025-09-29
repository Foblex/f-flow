import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CalculateNodeConnectorsConnectableSidesRequest } from './calculate-node-connectors-connectable-sides-request';
import { EFConnectableSide, FConnectorBase } from '../../../f-connectors';
import { CalculateConnectableSideByConnectedPositionsRequest } from './calculate-connectable-side-by-connected-positions';
import { CalculateConnectableSideByInternalPositionRequest } from './calculate-connectable-side-by-internal-position';

/**
 * Execution that calculates connectable sides for all connectors of a node.
 *
 * Responsibility:
 * - For each connector, decide the effective connectable side according to:
 *   - AUTO       -> by internal position relative to node host
 *   - CALCULATE  -> by positions of connected connectors
 *   - explicit   -> use the user-defined side as-is
 * - For each `toConnector` whose user side is CALCULATE, recalculate it as well.
 */
@Injectable()
@FExecutionRegister(CalculateNodeConnectorsConnectableSidesRequest)
export class CalculateNodeConnectorsConnectableSides
  implements IExecution<CalculateNodeConnectorsConnectableSidesRequest, void>
{
  private readonly _mediator = inject(FMediator);

  /**
   * Orchestrates side calculation for all connectors of the given node.
   *
   * @param request.node - Node whose connectors should be recalculated.
   */
  public handle({ node }: CalculateNodeConnectorsConnectableSidesRequest): void {
    node.connectors.forEach((connector: FConnectorBase) => {
      this._updateConnectorSide(connector);
      this._updateConnectedTargets(connector);
    });
  }

  /**
   * Calculates and assigns the connectable side for a single connector.
   *
   * @param connector - The connector being updated.
   */
  private _updateConnectorSide(connector: FConnectorBase): void {
    connector.fConnectableSide = this._resolveSideForConnector(connector);
  }

  /**
   * Recalculates connectable sides for all `toConnector` items that are marked as CALCULATE.
   *
   * @param source - The source connector whose outgoing connections should be processed.
   */
  private _updateConnectedTargets(source: FConnectorBase): void {
    source.toConnector.forEach((target) => {
      if (target.userFConnectableSide === EFConnectableSide.CALCULATE) {
        target.fConnectableSide = this._resolveSideByConnectedPositions(target);
      }
    });
  }

  /**
   * Resolves the effective side for a connector according to its user preference.
   *
   * @param connector - The connector to resolve side for.
   * @returns {EFConnectableSide} - The resolved side.
   */
  private _resolveSideForConnector(connector: FConnectorBase): EFConnectableSide {
    const preference = connector.userFConnectableSide;

    if (preference === EFConnectableSide.AUTO) {
      return this._resolveSideByInternalPosition(connector);
    }

    if (preference === EFConnectableSide.CALCULATE) {
      return this._resolveSideByConnectedPositions(connector);
    }

    // Explicit side set by the user
    return preference;
  }

  /**
   * Calculates side using the connector's internal position relative to the node host.
   * Delegates to `CalculateConnectableSideByInternalPositionRequest`.
   *
   * @param connector - Current connector.
   * @returns {EFConnectableSide}
   */
  private _resolveSideByInternalPosition(connector: FConnectorBase): EFConnectableSide {
    return this._mediator.execute(new CalculateConnectableSideByInternalPositionRequest(connector));
  }

  /**
   * Calculates side using average positions of connectors connected to the given connector.
   * Delegates to `CalculateConnectableSideByConnectedPositionsRequest`.
   *
   * @param connector - Current connector.
   * @returns {EFConnectableSide}
   */
  private _resolveSideByConnectedPositions(connector: FConnectorBase): EFConnectableSide {
    return this._mediator.execute(
      new CalculateConnectableSideByConnectedPositionsRequest(connector),
    );
  }
}
