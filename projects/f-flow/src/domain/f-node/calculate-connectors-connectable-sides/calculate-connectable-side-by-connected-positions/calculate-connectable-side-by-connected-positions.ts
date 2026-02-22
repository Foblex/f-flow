import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CalculateConnectableSideByConnectedPositionsRequest } from './calculate-connectable-side-by-connected-positions-request';
import { FConnectorBase } from '../../../../f-connectors';
import { IPoint, IRect } from '@foblex/2d';
import { determineSide } from '../utils';
import { CALCULATABLE_SIDES } from '../constants';
import { TCalculateMode } from '../models';
import { GetNormalizedElementRectRequest } from '../../../get-normalized-element-rect';
import { EFConnectableSide } from '../../../../f-connection-v2';

/**
 * Execution that calculates the connectable side for a connector
 * based on positions of connected connectors and allowed sides.
 */
@Injectable()
@FExecutionRegister(CalculateConnectableSideByConnectedPositionsRequest)
export class CalculateConnectableSideByConnectedPositions implements IExecution<
  CalculateConnectableSideByConnectedPositionsRequest,
  EFConnectableSide
> {
  private readonly _mediator = inject(FMediator);

  /**
   * Entry point (hot path). Avoids intermediate arrays and redundant allocations.
   *
   * @param request - Contains the connector and optionally allowed sides.
   * @returns {EFConnectableSide} - The chosen connectable side.
   */
  public handle({
    connector,
    pointerPosition,
  }: CalculateConnectableSideByConnectedPositionsRequest): EFConnectableSide {
    const mode = connector.userFConnectableSide as TCalculateMode;
    const selfCenter = this._getConnectorRect(connector.hostElement).gravityCenter;
    const acc = this._accumulateConnectedCenters(
      connector.hostElement,
      connector.toConnector,
      pointerPosition,
    );

    const avgX = acc.sumX / acc.count;
    const avgY = acc.sumY / acc.count;

    return determineSide(selfCenter.x, selfCenter.y, avgX, avgY, CALCULATABLE_SIDES[mode]);
  }

  private _accumulateConnectedCenters(
    selfHost: HTMLElement | SVGElement,
    connected: FConnectorBase[] | null | undefined,
    pointerPosition: IPoint | undefined,
  ): { sumX: number; sumY: number; count: number } {
    let sumX = pointerPosition?.x || 0;
    let sumY = pointerPosition?.y || 0;
    let count = pointerPosition ? 1 : 0;

    if (connected && connected.length) {
      for (let i = 0; i < connected.length; i++) {
        const el = connected[i].hostElement;
        if (el === selfHost) continue;

        const c = this._getConnectorRect(el).gravityCenter;
        sumX += c.x;
        sumY += c.y;
        count++;
      }
    }

    return { sumX, sumY, count };
  }

  private _getConnectorRect(element: HTMLElement | SVGElement): IRect {
    return this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(element));
  }
}
