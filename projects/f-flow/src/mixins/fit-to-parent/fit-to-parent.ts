import { AbstractConstructor, Constructor } from '../constructor';
import { ICanFitToParent } from './i-can-fit-to-parent';
import { ITransformable } from '../i-transformable';
import { IPoint, IRect, PointExtensions } from '@foblex/2d';

type CanFitToParentConstructor = Constructor<ICanFitToParent> & AbstractConstructor<ICanFitToParent>;

export function mixinFitToParent<T extends AbstractConstructor<ITransformable>>(base: T): CanFitToParentConstructor & T;
export function mixinFitToParent<T extends Constructor<ITransformable>>(base: T): CanFitToParentConstructor & T {
  return class extends base {

    public fitToParent(rect: IRect, parentRect: IRect, points: IPoint[], toCenter: IPoint): void {
      this.transform.scaledPosition = PointExtensions.initialize();
      this.transform.position = this.getZeroPositionWithoutScale(points);
      const itemsContainerWidth = (rect.width / this.transform.scale) + toCenter.x;
      const itemsContainerHeight = (rect.height / this.transform.scale) + toCenter.y;
      if (
          (itemsContainerWidth > parentRect.width || itemsContainerHeight > parentRect.height) ||
          itemsContainerWidth < parentRect.width && itemsContainerHeight < parentRect.height
      ) {
        this.transform.scale = Math.min(parentRect.width / itemsContainerWidth, parentRect.height / itemsContainerHeight);
      }

      const newX = (parentRect.width - itemsContainerWidth * this.transform.scale) / 2 - this.transform.position.x * this.transform.scale;
      const newY = (parentRect.height - itemsContainerHeight * this.transform.scale) / 2 - this.transform.position.y * this.transform.scale;

      this.transform.position = PointExtensions.initialize(newX + (toCenter.x / 2) * this.transform.scale, newY + (toCenter.y / 2) * this.transform.scale)

    }

    private getZeroPositionWithoutScale(points: IPoint[]): IPoint {
      const xPoint = points.length ? Math.min(...points.map((point) => point.x)) : 0;
      const yPoint = points.length ? Math.min(...points.map((point) => point.y)) : 0;
      return PointExtensions.initialize(xPoint, yPoint)
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
