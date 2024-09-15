import { AbstractConstructor, Constructor } from './constructor';
import { ITransformable } from './i-transformable';
import { IPoint, PointExtensions } from '@foblex/2d';

export interface ICanChangePosition {

  setPosition(position: IPoint): void;

  getPosition(): IPoint;
}

type CanChangePositionConstructor = Constructor<ICanChangePosition> & AbstractConstructor<ICanChangePosition>;

export function mixinChangePosition<T extends AbstractConstructor<ITransformable>>(base: T): CanChangePositionConstructor & T;
export function mixinChangePosition<T extends Constructor<ITransformable>>(base: T): CanChangePositionConstructor & T {
  return class extends base {

    public getPosition(): IPoint {
      return this.transform.position;
    }

    public setPosition(position: IPoint): void {
      this.transform.position = PointExtensions.copy(position);
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
