import { IPoint, IRect, RectExtensions } from "@foblex/2d";
import { IConstraintEdges } from "./rect-constraint";

export function expandRectFromBaseline(boundingRect: IRect, overflow: IPoint, edges: IConstraintEdges): IRect {
  let { x, y, width, height } = boundingRect;

  if (edges.right && overflow.x > 0) {
width += overflow.x;
}
  if (edges.left && overflow.x > 0) {
    x -= overflow.x;
    width += overflow.x;
  }

  if (edges.bottom && overflow.y > 0) {
height += overflow.y;
}
  if (edges.top && overflow.y > 0) {
    y -= overflow.y;
    height += overflow.y;
  }

  return RectExtensions.initialize(x, y, width, height);
}
