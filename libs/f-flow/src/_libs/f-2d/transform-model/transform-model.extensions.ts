import { ITransformModel } from './i-transform-model';
import { parseTransformModel } from './parse-transform-model';
import { defaultTransformModel } from './default-transform-model';
import { PointExtensions } from '../point';

export class TransformModelExtensions {
  public static toString(transform: ITransformModel): string {
    const position = PointExtensions.sum(transform.position, transform.scaledPosition);

    return `matrix(${transform.scale}, 0, 0, ${transform.scale}, ${position.x}, ${position.y})`;
  }

  public static fromString(value: string | null): ITransformModel | undefined {
    return parseTransformModel(value);
  }

  public static default(): ITransformModel {
    return defaultTransformModel();
  }
}
