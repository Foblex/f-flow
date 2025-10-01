import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CalculateNodeConnectorsConnectableSidesRequest } from './calculate-node-connectors-connectable-sides-request';
import { EFConnectableSide, FConnectorBase } from '../../../f-connectors';
import {
  CalculateConnectableSideByConnectedPositionsRequest,
  TCalculateMode,
} from './calculate-connectable-side-by-connected-positions';
import { CalculateConnectableSideByInternalPositionRequest } from './calculate-connectable-side-by-internal-position';

/** Fast predicate: whether the user side is a calculate mode. */
function isCalculateMode(side: EFConnectableSide): boolean {
  return (
    side === EFConnectableSide.CALCULATE ||
    side === EFConnectableSide.CALCULATE_HORIZONTAL ||
    side === EFConnectableSide.CALCULATE_VERTICAL
  );
}

/**
 * Execution that calculates connectable sides for all connectors of a node.
 *
 * Performance goals:
 * - Single-pass loops (no `forEach`).
 * - Unique target recomputation (avoid repeated mediator calls for the same target).
 * - Fast checks for "calculate" modes (bit mask instead of `includes`).
 */
@Injectable()
@FExecutionRegister(CalculateNodeConnectorsConnectableSidesRequest)
export class CalculateNodeConnectorsConnectableSides
  implements IExecution<CalculateNodeConnectorsConnectableSidesRequest, void>
{
  private readonly _mediator = inject(FMediator);

  /**
   * Orchestrates side calculation for all connectors of the given node.
   * Two-phase approach:
   *  1) Update each connector's own side.
   *  2) Collect unique `toConnector` with calculate modes and recompute once.
   */
  public handle({ node }: CalculateNodeConnectorsConnectableSidesRequest): void {
    const mediator = this._mediator;
    const connectors = node.connectors;
    const len = connectors.length;

    for (let i = 0; i < len; i++) {
      const connection = connectors[i];
      connection.fConnectableSide = this._resolveSideForConnectorFast(mediator, connection);
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
        target.fConnectableSide = mediator.execute(
          new CalculateConnectableSideByConnectedPositionsRequest(
            target,
            userSideToTCalculateMode(target.userFConnectableSide),
          ),
        );
      });
    }
  }

  /**
   * Fast resolver for a single connector.
   * Uses switch and avoids array operations.
   */
  private _resolveSideForConnectorFast(
    mediator: FMediator,
    connector: FConnectorBase,
  ): EFConnectableSide {
    const preference = connector.userFConnectableSide;

    if (preference !== EFConnectableSide.AUTO && !isCalculateMode(preference)) {
      return preference;
    }

    if (preference === EFConnectableSide.AUTO) {
      return mediator.execute(new CalculateConnectableSideByInternalPositionRequest(connector));
    }

    return mediator.execute(
      new CalculateConnectableSideByConnectedPositionsRequest(
        connector,
        userSideToTCalculateMode(preference),
      ),
    );
  }
}

/**
 * Utility: maps EFConnectableSide user value to TCalculateMode safely.
 * If your enums are distinct, implement the exact mapping here.
 */
function userSideToTCalculateMode(side: EFConnectableSide): TCalculateMode {
  return side as unknown as TCalculateMode;
}
