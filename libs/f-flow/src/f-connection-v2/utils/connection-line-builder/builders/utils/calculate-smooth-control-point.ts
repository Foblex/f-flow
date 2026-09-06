import { IPoint } from '@foblex/2d';

/**
 * Control point for a cubic segment end that lies on an intermediate waypoint.
 * The tangent runs from the previous toward the next neighbor (Catmull-Rom
 * style), so the two segments meeting at the waypoint share one tangent
 * direction and the curve passes through it smoothly. Connector sides shape
 * only the real endpoints of the connection, never the waypoints.
 *
 * `distance` is positive for an outgoing control point and negative for an
 * incoming one.
 */
export function calculateSmoothControlPoint(
  anchor: IPoint,
  previous: IPoint,
  next: IPoint,
  distance: number,
): IPoint {
  const dx = next.x - previous.x;
  const dy = next.y - previous.y;
  const length = Math.hypot(dx, dy);

  if (length === 0) {
    return { x: anchor.x, y: anchor.y };
  }

  return {
    x: anchor.x + (dx / length) * distance,
    y: anchor.y + (dy / length) * distance,
  };
}
