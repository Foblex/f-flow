import { IPoint, ITransformModel, Point } from '@foblex/2d';

export function calculatePointerInFlow(
  position: IPoint,
  flowHost: HTMLElement,
  transform: ITransformModel,
): Point {
  if (!flowHost) {
    return Point.fromPoint(position);
  }

  return Point.fromPoint(position)
    .elementTransform(flowHost)
    .sub(transform.scaledPosition)
    .sub(transform.position)
    .div(transform.scale);
}
