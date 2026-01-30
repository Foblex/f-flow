import { inject, Injectable } from '@angular/core';
import { MoveConnectionWaypointFinalizeRequest } from './move-connection-waypoint-finalize-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { MoveConnectionWaypointHandler } from '../move-connection-waypoint-handler';
import { FDraggableDataContext } from '../../../../f-draggable';

@Injectable()
@FExecutionRegister(MoveConnectionWaypointFinalizeRequest)
export class MoveConnectionWaypointFinalize
  implements IExecution<MoveConnectionWaypointFinalizeRequest, void>
{
  private readonly _dragContext = inject(FDraggableDataContext);

  private get _fDragHandler(): MoveConnectionWaypointHandler {
    return this._dragContext.draggableItems[0] as MoveConnectionWaypointHandler;
  }

  public handle(_request: MoveConnectionWaypointFinalizeRequest): void {
    if (!this._isDroppedConnectionReassignEvent()) {
      return;
    }
    this._fDragHandler.onPointerUp();
  }

  private _isDroppedConnectionReassignEvent(): boolean {
    return this._dragContext.draggableItems.some((x) => x instanceof MoveConnectionWaypointHandler);
  }
}
