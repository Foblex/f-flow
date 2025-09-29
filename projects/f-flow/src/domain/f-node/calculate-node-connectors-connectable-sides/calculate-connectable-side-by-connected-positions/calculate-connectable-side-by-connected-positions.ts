import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CalculateConnectableSideByConnectedPositionsRequest } from './calculate-connectable-side-by-connected-positions-request';
import { EFConnectableSide, FConnectorBase } from '../../../../f-connectors';
import { IPoint, PointExtensions, RectExtensions } from '@foblex/2d';
import { CalculateConnectableSideByInternalPositionRequest } from '../calculate-connectable-side-by-internal-position';

/**
 * Execution that calculates the connectable side for a connector
 * based on the positions of its connected connectors.
 */
@Injectable()
@FExecutionRegister(CalculateConnectableSideByConnectedPositionsRequest)
export class CalculateConnectableSideByConnectedPositions
  implements IExecution<CalculateConnectableSideByConnectedPositionsRequest, EFConnectableSide>
{
  private readonly _mediator = inject(FMediator);

  /**
   * Handles the request to calculate the connectable side for a connector
   * based on the positions of its connected connectors.
   *
   * @param request - Contains the connector host element and its connected connectors.
   * @returns {EFConnectableSide} - The calculated connectable side.
   */
  public handle({
    connector,
  }: CalculateConnectableSideByConnectedPositionsRequest): EFConnectableSide {
    const selfCenter = RectExtensions.fromElement(connector.hostElement).gravityCenter;
    const targetCenters = this._getConnectedCenters(connector.hostElement, connector.toConnector);

    if (!targetCenters.length) {
      return this._mediator.execute(
        new CalculateConnectableSideByInternalPositionRequest(connector),
      );
    }

    const avg = this._calculateAveragePoint(targetCenters);

    return this._determineSide(selfCenter, avg);
  }

  /**
   * Extracts the gravity centers of connected connectors, excluding the current connector.
   *
   * @param selfHost - The host element of the current connector.
   * @param connected - The list of connected connectors.
   * @returns {Array<{x: number, y: number}>} - An array of gravity center coordinates.
   */
  private _getConnectedCenters(
    selfHost: HTMLElement | SVGElement,
    connected: FConnectorBase[],
  ): { x: number; y: number }[] {
    return (connected ?? [])
      .map((c) => c?.hostElement)
      .filter((el): el is HTMLElement | SVGElement => !!el && el !== selfHost)
      .map((el) => RectExtensions.fromElement(el).gravityCenter);
  }

  /**
   * Calculates the average point (center of mass) from a set of points.
   *
   * @param points - An array of point objects with x and y coordinates.
   * @returns {{x: number, y: number}} - The average x and y coordinate.
   */
  private _calculateAveragePoint(points: IPoint[]): IPoint {
    const sum = points.reduce((result: IPoint, p: IPoint) => {
      result.x += p.x;
      result.y += p.y;

      return result;
    }, PointExtensions.initialize());

    return {
      x: sum.x / points.length,
      y: sum.y / points.length,
    };
  }

  /**
   * Determines the connectable side of the current connector relative to the
   * average position of its connected connectors.
   *
   * @param self - The gravity center of the current connector.
   * @param avg - The average gravity center of connected connectors.
   * @returns {EFConnectableSide} - The chosen side (LEFT, RIGHT, TOP, BOTTOM).
   */
  private _determineSide(
    self: { x: number; y: number },
    avg: { x: number; y: number },
  ): EFConnectableSide {
    const dx = avg.x - self.x;
    const dy = avg.y - self.y;
    const snapEps = 2; // px — hysteresis threshold to avoid side-flipping near diagonals

    if (Math.abs(dx) - Math.abs(dy) > snapEps) {
      return dx < 0 ? EFConnectableSide.LEFT : EFConnectableSide.RIGHT;
    }
    if (Math.abs(dy) - Math.abs(dx) > snapEps) {
      return dy < 0 ? EFConnectableSide.TOP : EFConnectableSide.BOTTOM;
    }

    // When differences are nearly equal, prefer vertical orientation for stability
    return dy < 0 ? EFConnectableSide.TOP : EFConnectableSide.BOTTOM;
  }
}
