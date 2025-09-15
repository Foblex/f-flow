import { Signal } from '@angular/core';
import { PolylineContentAlign } from './polyline-content-align';

/** Domain contract for content item to be placed along the path. */
export interface IPolylineContent {
  position: Signal<number>;

  offset: Signal<number>;

  align: Signal<PolylineContentAlign>;

  hostElement: HTMLElement;
}
