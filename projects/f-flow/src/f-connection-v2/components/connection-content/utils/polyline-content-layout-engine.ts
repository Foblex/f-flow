import { IPoint } from '@foblex/2d';
import { PolylineSampler } from './polyline-sampler';
import { IPolylineContent } from './i-polyline-content';
import { PolylineContentPlace } from './polyline-content-place';

/**
 * Engine that orchestrates positioning and orientation of all
 * connection contents along a computed path.
 */
export class ConnectionContentLayoutEngine {
  constructor(private readonly _placement = new PolylineContentPlace()) {}

  public layout(points: IPoint[], contents: Iterable<IPolylineContent>): number {
    const sampler = new PolylineSampler(points);
    const total = sampler.totalLength;

    for (const item of contents) {
      const { position, rotationDeg } = this._placement.compute(sampler, item);
      item.hostElement.style.transform = this._createTransformString(position, rotationDeg);
    }

    return total;
  }

  private _createTransformString(position: IPoint, rotationDeg: number): string {
    return `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) rotate(${rotationDeg}deg)`;
  }
}
