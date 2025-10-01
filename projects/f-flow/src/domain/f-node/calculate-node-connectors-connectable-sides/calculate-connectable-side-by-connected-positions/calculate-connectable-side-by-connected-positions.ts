import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CalculateConnectableSideByConnectedPositionsRequest } from './calculate-connectable-side-by-connected-positions-request';
import { EFConnectableSide, FConnectorBase } from '../../../../f-connectors';
import { RectExtensions } from '@foblex/2d';
import { CalculateConnectableSideByInternalPositionRequest } from '../calculate-connectable-side-by-internal-position';

const SNAP_EPS = 2;

const enum SideMask {
  NONE = 0,
  LEFT = 1 << 0,
  RIGHT = 1 << 1,
  TOP = 1 << 2,
  BOTTOM = 1 << 3,
  ALL = (1 << 4) - 1,
}

const CALCULATE_SIDES = {
  [EFConnectableSide.CALCULATE]: [
    EFConnectableSide.TOP,
    EFConnectableSide.BOTTOM,
    EFConnectableSide.LEFT,
    EFConnectableSide.RIGHT,
  ],
  [EFConnectableSide.CALCULATE_HORIZONTAL]: [EFConnectableSide.LEFT, EFConnectableSide.RIGHT],
  [EFConnectableSide.CALCULATE_VERTICAL]: [EFConnectableSide.TOP, EFConnectableSide.BOTTOM],
};

/**
 * Execution that calculates the connectable side for a connector
 * based on positions of connected connectors and allowed sides.
 */
@Injectable()
@FExecutionRegister(CalculateConnectableSideByConnectedPositionsRequest)
export class CalculateConnectableSideByConnectedPositions
  implements IExecution<CalculateConnectableSideByConnectedPositionsRequest, EFConnectableSide>
{
  private readonly _mediator = inject(FMediator);

  /**
   * Entry point (hot path). Avoids intermediate arrays and redundant allocations.
   *
   * @param request - Contains the connector and optionally allowed sides.
   * @returns {EFConnectableSide} - The chosen connectable side.
   */
  public handle({
    connector,
    mode,
  }: CalculateConnectableSideByConnectedPositionsRequest): EFConnectableSide {
    const selfCenter = RectExtensions.fromElement(connector.hostElement).gravityCenter;

    const acc = this._accumulateConnectedCenters(connector.hostElement, connector.toConnector);

    if (acc.count === 0) {
      return this._mediator.execute(
        new CalculateConnectableSideByInternalPositionRequest(connector),
      );
    }

    const avgX = acc.sumX / acc.count;
    const avgY = acc.sumY / acc.count;

    const mask = this._toSideMask(CALCULATE_SIDES[mode]);

    return this._determineSide(selfCenter.x, selfCenter.y, avgX, avgY, mask);
  }

  /**
   * Accumulates sum of gravity centers and count, excluding the current host.
   * Single pass, minimal allocations.
   */
  private _accumulateConnectedCenters(
    selfHost: HTMLElement | SVGElement,
    connected: FConnectorBase[] | null | undefined,
  ): { sumX: number; sumY: number; count: number } {
    let sumX = 0;
    let sumY = 0;
    let count = 0;

    if (connected && connected.length) {
      for (let i = 0; i < connected.length; i++) {
        const el = connected[i]?.hostElement as HTMLElement | SVGElement | undefined;
        if (!el || el === selfHost) continue;

        const c = RectExtensions.fromElement(el).gravityCenter;
        sumX += c.x;
        sumY += c.y;
        count++;
      }
    }

    return { sumX, sumY, count };
  }

  /**
   * Converts allowed sides array to a compact bit mask.
   * If not provided or empty -> all sides allowed.
   */
  private _toSideMask(allowed?: EFConnectableSide[]): SideMask {
    if (!allowed || allowed.length === 0) return SideMask.ALL;

    let mask = SideMask.NONE;
    for (let i = 0; i < allowed.length; i++) {
      switch (allowed[i]) {
        case EFConnectableSide.LEFT:
          mask |= SideMask.LEFT;
          break;
        case EFConnectableSide.RIGHT:
          mask |= SideMask.RIGHT;
          break;
        case EFConnectableSide.TOP:
          mask |= SideMask.TOP;
          break;
        case EFConnectableSide.BOTTOM:
          mask |= SideMask.BOTTOM;
          break;
      }
    }

    return mask || SideMask.ALL;
  }

  /**
   * Determines final side using ideal side first; if disallowed, picks best fallback.
   * Inputs are numbers to avoid object wrappers on hot path.
   */
  private _determineSide(
    selfX: number,
    selfY: number,
    avgX: number,
    avgY: number,
    allowedMask: SideMask,
  ): EFConnectableSide {
    const dx = avgX - selfX;
    const dy = avgY - selfY;

    const ideal = this._pickIdealSide(dx, dy);

    if (this._isAllowed(ideal, allowedMask)) {
      return ideal;
    }

    return this._pickFallbackSide(dx, dy, allowedMask, ideal);
  }

  /**
   * Picks the "ideal" side based on vector (dx, dy) with hysteresis.
   */
  private _pickIdealSide(dx: number, dy: number): EFConnectableSide {
    const ax = dx < 0 ? -dx : dx;
    const ay = dy < 0 ? -dy : dy;

    if (ax - ay > SNAP_EPS) {
      return dx < 0 ? EFConnectableSide.LEFT : EFConnectableSide.RIGHT;
    }
    if (ay - ax > SNAP_EPS) {
      return dy < 0 ? EFConnectableSide.TOP : EFConnectableSide.BOTTOM;
    }

    return dy < 0 ? EFConnectableSide.TOP : EFConnectableSide.BOTTOM;
  }

  /**
   * Quick membership check via bit mask.
   */
  private _isAllowed(side: EFConnectableSide, mask: SideMask): boolean {
    switch (side) {
      case EFConnectableSide.LEFT:
        return (mask & SideMask.LEFT) !== 0;
      case EFConnectableSide.RIGHT:
        return (mask & SideMask.RIGHT) !== 0;
      case EFConnectableSide.TOP:
        return (mask & SideMask.TOP) !== 0;
      case EFConnectableSide.BOTTOM:
        return (mask & SideMask.BOTTOM) !== 0;
      default:
        return true;
    }
  }

  /**
   * Picks the best available side from allowed mask by maximizing directional score.
   * No intermediate objects, constant-time operations.
   */
  private _pickFallbackSide(
    dx: number,
    dy: number,
    allowedMask: SideMask,
    ideal: EFConnectableSide,
  ): EFConnectableSide {
    let bestSide: EFConnectableSide = ideal;
    let bestScore = -Infinity;

    if (allowedMask & SideMask.RIGHT) {
      const s = dx;
      if (s > bestScore) {
        bestScore = s;
        bestSide = EFConnectableSide.RIGHT;
      }
    }
    if (allowedMask & SideMask.LEFT) {
      const s = -dx;
      if (s > bestScore) {
        bestScore = s;
        bestSide = EFConnectableSide.LEFT;
      }
    }
    if (allowedMask & SideMask.BOTTOM) {
      const s = dy;
      if (s > bestScore) {
        bestScore = s;
        bestSide = EFConnectableSide.BOTTOM;
      }
    }
    if (allowedMask & SideMask.TOP) {
      const s = -dy;
      if (s > bestScore) {
        bestScore = s;
        bestSide = EFConnectableSide.TOP;
      }
    }

    return bestSide;
  }
}
