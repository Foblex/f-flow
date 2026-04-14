import { inject, Injectable } from '@angular/core';
import { DragConnectionWaypointFinalizeRequest } from './drag-connection-waypoint-finalize-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { DragConnectionWaypointHandler } from '../drag-connection-waypoint-handler';
import { FDraggableDataContext } from '../../../../f-draggable';

@Injectable()
@FExecutionRegister(DragConnectionWaypointFinalizeRequest)
export class DragConnectionWaypointFinalize
  implements IExecution<DragConnectionWaypointFinalizeRequest, void>
{
  private readonly _dragContext = inject(FDraggableDataContext);

  private get _fDragHandler(): DragConnectionWaypointHandler {
    return this._dragContext.draggableItems[0] as DragConnectionWaypointHandler;
  }

  public handle(_request: DragConnectionWaypointFinalizeRequest): void {
    if (!this._isDroppedConnectionReassignEvent()) {
      return;
    }
    this._fDragHandler.onPointerUp();
  }

  private _isDroppedConnectionReassignEvent(): boolean {
    return this._dragContext.draggableItems.some((x) => x instanceof DragConnectionWaypointHandler);
  }
}
