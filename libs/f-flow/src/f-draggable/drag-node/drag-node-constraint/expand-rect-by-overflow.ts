import { IPoint, IRect, RectExtensions } from '@foblex/2d';
import { IConstraintEdges } from './delta-clamp';

export function expandRectByOverflow(
  baselineRect: IRect,
  overflowDelta: IPoint,
  edges: IConstraintEdges,
): IRect {
  let { x, y, width, height } = baselineRect;

  if (edges.right && overflowDelta.x > 0) {
    width += overflowDelta.x;
  }
  if (edges.left && overflowDelta.x > 0) {
    x -= overflowDelta.x;
    width += overflowDelta.x;
  }

  if (edges.bottom && overflowDelta.y > 0) {
    height += overflowDelta.y;
  }
  if (edges.top && overflowDelta.y > 0) {
    y -= overflowDelta.y;
    height += overflowDelta.y;
  }

  return RectExtensions.initialize(x, y, width, height);
}
