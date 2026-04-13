import { ElementRef, inject, InjectionToken, Signal } from '@angular/core';
import { IPolylineContent, PolylineContentAlign } from '../utils';

export const F_CONNECTION_CONTENT = new InjectionToken<FConnectionContentBase>(
  'F_CONNECTION_CONTENT',
);

export abstract class FConnectionContentBase implements IPolylineContent {
  /**
   * The host DOM element to which the directive is applied.
   * Used internally for positioning calculations.
   */
  public readonly hostElement = inject(ElementRef<HTMLElement>).nativeElement;

  /**
   * Position along the connection.
   *
   * A normalized value in the range `0..1`:
   * - `0` — at the start of the connection,
   * - `1` — at the end of the connection,
   * - `0.5` — at the middle of the connection (default).
   */
  public abstract position: Signal<number>;

  /**
   * Perpendicular offset from the connection line (in pixels).
   *
   * - Positive values shift the element to the right
   *   relative to the line direction.
   * - Negative values shift it to the left.
   * - Default: `0` (no shift).
   */
  public abstract offset: Signal<number>;

  /**
   * Controls the orientation (rotation) of the content relative to the connection.
   *
   * Possible values:
   * - `'none'` — no rotation (default).
   * - `'along'` — aligned along the path (tangent).
   */
  public abstract align: Signal<PolylineContentAlign>;
}
