import { AbstractConstructor, Constructor } from '../constructor';
import { ICanChangeZoom } from './i-can-change-zoom';
import { ITransformable } from '../i-transformable';
import { IPoint, PointExtensions } from '@foblex/2d';

type CanChangeZoomConstructor = Constructor<ICanChangeZoom> & AbstractConstructor<ICanChangeZoom>;

export function mixinChangeZoom<T extends AbstractConstructor<ITransformable>>(base: T): CanChangeZoomConstructor & T;
export function mixinChangeZoom<T extends Constructor<ITransformable>>(base: T): CanChangeZoomConstructor & T {
  return class extends base {

    public setZoom(scaleValue: number, toPosition: IPoint): void {
      if (scaleValue !== this.transform.scale) {

        const summaryPosition = PointExtensions.sum(this.transform.scaledPosition, this.transform.position);

        const newX = toPosition.x - (toPosition.x - summaryPosition.x) * scaleValue / this.transform.scale;
        const newY = toPosition.y - (toPosition.y - summaryPosition.y) * scaleValue / this.transform.scale;

        this.transform.scale = scaleValue;
        this.transform.scaledPosition = PointExtensions.sub(PointExtensions.initialize(newX, newY), this.transform.position);
      }
    }

    public setScalePosition(value: IPoint): void {
      this.transform.scaledPosition = value;
    }

    public resetZoom(): void {
      this.transform.scale = 1;
      this.transform.scaledPosition = PointExtensions.initialize();
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
