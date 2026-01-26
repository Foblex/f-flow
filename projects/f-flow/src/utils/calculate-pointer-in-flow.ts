import { IPoint, ITransformModel, Point } from '@foblex/2d';

export function calculatePointerInFlow(
  event: { getPosition: () => IPoint },
  flowHost: HTMLElement,
  transform: ITransformModel,
): Point {
  return Point.fromPoint(event.getPosition())
    .elementTransform(flowHost)
    .sub(transform.scaledPosition)
    .sub(transform.position)
    .div(transform.scale);
}
