import { Injectable, InjectionToken, inject } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CalculateConnectableSideByInternalPositionRequest } from './calculate-connectable-side-by-internal-position-request';
import { EFConnectableSide } from '../../../../f-connectors';
import { RectExtensions } from '@foblex/2d';
import { IsDragStartedRequest } from '../../../f-draggable';

/**
 * Injection token for configuring the side detection tolerance (in pixels).
 * A new side must beat the previous side by more than this value to switch.
 */
export const CONNECTABLE_SIDE_EPSILON = new InjectionToken<number>('CONNECTABLE_SIDE_EPSILON');

/**
 * Calculates the connectable side of a connector relative to its node host.
 *
 * Optimizations & behavior:
 * - Hysteresis via epsilon to avoid jitter near boundaries.
 * - Per-connector memoization using WeakMap (no leaks).
 * - During drag (isDragging === true) the last memorized side is returned immediately
 *   for maximum stability and performance; a safe fallback computes it if missing.
 */
@Injectable()
@FExecutionRegister(CalculateConnectableSideByInternalPositionRequest)
export class CalculateConnectableSideByInternalPosition
  implements IExecution<CalculateConnectableSideByInternalPositionRequest, EFConnectableSide>
{
  private readonly _mediator = inject(FMediator);

  /**
   * Stores the last computed side per connector.
   * WeakMap ensures entries are garbage-collected with the connector objects.
   */
  private readonly _lastSide = new WeakMap<object, EFConnectableSide>();

  /** Pixel threshold to prevent side switching unless the new side is sufficiently better. */
  private readonly _epsilon: number = Math.max(
    0,
    inject(CONNECTABLE_SIDE_EPSILON, { optional: true }) ?? 2,
  );

  /**
   * Entry point: returns the connectable side for a given connector.
   * If a drag is in progress, returns the last memorized side for stability.
   */
  public handle({
    connector,
  }: CalculateConnectableSideByInternalPositionRequest): EFConnectableSide {
    // Fast path during drag: use memorized side (guaranteed to be present by caller’s contract).
    if (this._isDragging()) {
      const cached = this._lastSide.get(connector);
      if (cached !== undefined) return cached;
      // Safe fallback: compute once and cache.
      const computed = this._getSideByDelta(connector.hostElement, connector.fNodeHost, connector);
      this._lastSide.set(connector, computed);

      return computed;
    }

    // Normal path: compute with hysteresis, then remember.
    const side = this._getSideByDelta(connector.hostElement, connector.fNodeHost, connector);
    this._lastSide.set(connector, side);

    return side;
  }

  /**
   * Determines the side of the connector relative to the node host by
   * comparing distances from the connector's gravity center to each host edge.
   *
   * Hysteresis rule:
   * If the previously chosen side is within `epsilon` pixels of the new best side,
   * keep the previous side to avoid flicker.
   *
   * @param connectorHost - The connector element (HTML or SVG).
   * @param nodeHost - The parent node element (HTML or SVG).
   * @param connectorKey - The connector object, used as WeakMap key.
   * @returns The most stable connectable side.
   */
  private _getSideByDelta(
    connectorHost: HTMLElement | SVGElement,
    nodeHost: HTMLElement | SVGElement,
    connectorKey: object,
  ): EFConnectableSide {
    const childRect = RectExtensions.fromElement(connectorHost);
    const parentRect = nodeHost.getBoundingClientRect();

    const cx = childRect.gravityCenter.x;
    const cy = childRect.gravityCenter.y;

    const deltaLeft = cx - parentRect.left;
    const deltaRight = parentRect.right - cx;
    const deltaTop = cy - parentRect.top;
    const deltaBottom = parentRect.bottom - cy;

    // Determine best side (min delta) in one pass
    let minIdx = 0;
    let minVal = deltaLeft;

    // i=1..3 correspond to Right, Top, Bottom respectively
    const candidates = [deltaLeft, deltaRight, deltaTop, deltaBottom] as const;
    for (let i = 1; i < 4; i++) {
      const v = candidates[i];
      if (v < minVal) {
        minVal = v;
        minIdx = i;
      }
    }

    let candidate =
      minIdx === 0
        ? EFConnectableSide.LEFT
        : minIdx === 1
          ? EFConnectableSide.RIGHT
          : minIdx === 2
            ? EFConnectableSide.TOP
            : EFConnectableSide.BOTTOM;

    // Hysteresis: prefer previously chosen side if it's almost as good
    const prev = this._lastSide.get(connectorKey);
    if (prev !== undefined && prev !== candidate) {
      const prevIdx =
        prev === EFConnectableSide.LEFT
          ? 0
          : prev === EFConnectableSide.RIGHT
            ? 1
            : prev === EFConnectableSide.TOP
              ? 2
              : 3;

      const prevDelta =
        prevIdx === 0
          ? deltaLeft
          : prevIdx === 1
            ? deltaRight
            : prevIdx === 2
              ? deltaTop
              : deltaBottom;

      // How much better the new side is (smaller is better)
      const advantage = prevDelta - minVal;
      if (advantage <= this._epsilon) {
        candidate = prev;
      }
    }

    return candidate;
  }

  /** Returns true if a drag operation is currently active. */
  private _isDragging(): boolean {
    return this._mediator.execute(new IsDragStartedRequest());
  }
}
