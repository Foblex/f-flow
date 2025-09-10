import { IPoint } from "@foblex/2d";
import { FConnectionBase } from "../../../../f-connection";

export function isPointerInsideStartOrEndDragHandles(connection: FConnectionBase, position: IPoint): boolean {
  return isDragHandleEnd(connection, position) || isDragHandleStart(connection, position);
}

export function isDragHandleEnd(connection: FConnectionBase, position: IPoint): boolean {
  return connection.fDragHandleEnd()?.point
    && _isPointInsideCircle(position, connection.fDragHandleEnd().point)
    && !connection.fDraggingDisabled();
}

export function isDragHandleStart(connection: FConnectionBase, position: IPoint): boolean {
  return !!connection.fDragHandleStart()?.point
    && _isPointInsideCircle(position, connection.fDragHandleStart()!.point)
    && !connection.fDraggingDisabled() && connection.fReassignableStart();
}

function _isPointInsideCircle(point: IPoint, circleCenter: IPoint): boolean {
  return (point.x - circleCenter.x) ** 2 + (point.y - circleCenter.y) ** 2 <= 8 ** 2;
}
