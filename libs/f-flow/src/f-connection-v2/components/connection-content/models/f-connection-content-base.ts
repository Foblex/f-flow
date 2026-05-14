import { DestroyRef, ElementRef, inject, InjectionToken, Signal } from '@angular/core';
import { ISize } from '@foblex/2d';
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

  // ResizeObserver-backed size cache. Avoids `getBoundingClientRect`
  // inside the placement loop, where one DOM read per label per redraw
  // forced a synchronous layout flush and dominated drag-time at a few
  // hundred labelled connections (issue #304). The observer also keeps
  // the cache correct when the label content actually resizes.
  //
  // The initial size is populated by the observer's first asynchronous
  // delivery — calling `getBoundingClientRect()` from the constructor
  // re-introduces the thrashing during Angular CD when many labels
  // mount in the same tick. Until the first delivery, the size stays
  // at zero; the only visible effect is that the edge-guard does not
  // push labels away from path endpoints on the very first frame.
  // Labels at `position` ≠ 0 / 1 are unaffected.
  private _cachedSize: ISize = { width: 0, height: 0 };
  private _observer: ResizeObserver | null = null;

  constructor() {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this._observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const rect = entry.contentRect;
        this._cachedSize = { width: rect.width, height: rect.height };
      }
    });
    this._observer.observe(this.hostElement);

    inject(DestroyRef).onDestroy(() => {
      this._observer?.disconnect();
      this._observer = null;
    });
  }

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

  public measureSize(): ISize {
    return this._cachedSize;
  }
}
