import { ITransformModel } from './i-transform-model';
import { parseTransformModel } from './parse-transform-model';
import { defaultTransformModel } from './default-transform-model';
import { PointExtensions } from '../point';

export class TransformModelExtensions {
  public static toString(transform: ITransformModel): string {
    const position = PointExtensions.sum(transform.position, transform.scaledPosition);

    return `matrix(${transform.scale}, 0, 0, ${transform.scale}, ${position.x}, ${position.y})`;
  }

  /**
   * @deprecated Not used by `@foblex/flow`; removed from the public API in v20. Depend on
   * `@foblex/2d` directly if you still need it.
   */
  public static fromString(value: string | null): ITransformModel | undefined {
    return parseTransformModel(value);
  }

  public static default(): ITransformModel {
    return defaultTransformModel();
  }
}
