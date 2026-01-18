import { inject, Injectable } from '@angular/core';
import { MoveControlPointFinalizeRequest } from './move-control-point-finalize-request';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { MoveControlPointHandler } from '../move-control-point-handler';
import { FDraggableDataContext, FDragHandlerResult } from '../../../../f-draggable';
import { IMoveControlPointResult } from '../i-move-control-point-result';
import { FComponentsStore } from '../../../../f-storage';

@Injectable()
@FExecutionRegister(MoveControlPointFinalizeRequest)
export class MoveControlPointFinalize implements IExecution<MoveControlPointFinalizeRequest, void> {
  private readonly _dragResult =
    inject<FDragHandlerResult<IMoveControlPointResult>>(FDragHandlerResult);

  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  private get _fDragHandler(): MoveControlPointHandler {
    return this._dragContext.draggableItems[0] as MoveControlPointHandler;
  }

  public handle(_request: MoveControlPointFinalizeRequest): void {
    if (!this._isDroppedConnectionReassignEvent()) {
      return;
    }
    this._fDragHandler.onPointerUp();
  }

  private _isDroppedConnectionReassignEvent(): boolean {
    return this._dragContext.draggableItems.some((x) => x instanceof MoveControlPointHandler);
  }
}
