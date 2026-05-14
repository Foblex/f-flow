import { Signal } from '@angular/core';
import { ISize } from '@foblex/2d';
import { PolylineContentAlign } from './polyline-content-align';

/** Domain contract for content item to be placed along the path. */
export interface IPolylineContent {
  position: Signal<number>;

  offset: Signal<number>;

  align: Signal<PolylineContentAlign>;

  hostElement: HTMLElement;

  /**
   * Returns the latest measured size of the content's host element.
   *
   * Implementations cache the size and refresh it via a
   * `ResizeObserver` rather than reading the DOM on every call —
   * placement runs in a tight loop interleaved with style writes, so
   * a per-call `getBoundingClientRect()` forces a synchronous layout
   * flush per label and turns drag into a layout-thrashing storm at
   * a few hundred labels (see issue #304).
   */
  measureSize(): ISize;
}
