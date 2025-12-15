import { IPoint } from '@foblex/2d';
import { FConnectionBase } from '../../../../f-connection';
import { EFConnectionType } from '../../../../f-connection/common';

export function isPointerInsideControlPoint(
  connection: FConnectionBase,
  position: IPoint,
): { isInside: boolean; controlPointIndex: number } {
  // Only check for custom-path connections
  if (connection.fType !== EFConnectionType.CUSTOM_PATH || connection.fDraggingDisabled()) {
    return { isInside: false, controlPointIndex: -1 };
  }

  const controlPoints = connection.fControlPoints;

  // Check each control point
  for (let i = 0; i < controlPoints.length; i++) {
    if (_isPointInsideCircle(position, controlPoints[i])) {
      return { isInside: true, controlPointIndex: i };
    }
  }

  return { isInside: false, controlPointIndex: -1 };
}

function _isPointInsideCircle(point: IPoint, circleCenter: IPoint): boolean {
  return (point.x - circleCenter.x) ** 2 + (point.y - circleCenter.y) ** 2 <= 8 ** 2;
}
