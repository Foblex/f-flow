import { AbstractConstructor, Constructor } from '../constructor';
import { ICanOneToOneCentering } from './i-can-one-to-one-centering';
import { ITransformable } from '../i-transformable';
import { IPoint, IRect, PointExtensions } from '@foblex/2d';

type CanOneToOneCenteringConstructor = Constructor<ICanOneToOneCentering> & AbstractConstructor<ICanOneToOneCentering>;

export function mixinOneToOneCentering<T extends AbstractConstructor<ITransformable>>(base: T): CanOneToOneCenteringConstructor & T;
export function mixinOneToOneCentering<T extends Constructor<ITransformable>>(base: T): CanOneToOneCenteringConstructor & T {
  return class extends base {

    public oneToOneCentering(rect: IRect, parentRect: IRect, points: IPoint[]): void {
      this.transform.scaledPosition = PointExtensions.initialize();
      this.transform.position = this.getZeroPositionWithoutScale(points);
      const itemsContainerWidth = rect.width / this.transform.scale;
      const itemsContainerHeight = rect.height / this.transform.scale;
      this.transform.scale = 1;

      const newX = (parentRect.width - itemsContainerWidth * this.transform.scale) / 2 - this.transform.position.x * this.transform.scale;
      const newY = (parentRect.height - itemsContainerHeight * this.transform.scale) / 2 - this.transform.position.y * this.transform.scale;

      this.transform.position = PointExtensions.initialize(newX, newY);
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
