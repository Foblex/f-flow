import { inject, Injectable } from '@angular/core';
import { FNodeRotateFinalizeRequest } from './f-node-rotate-finalize.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FNodeRotateDragHandler } from '../f-node-rotate.drag-handler';

@Injectable()
@FExecutionRegister(FNodeRotateFinalizeRequest)
export class FNodeRotateFinalizeExecution implements IExecution<FNodeRotateFinalizeRequest, void> {

  private readonly _draggableDataContext = inject(FDraggableDataContext);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handle(request: FNodeRotateFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    this._draggableDataContext.draggableItems.forEach((x) => {
      x.onPointerUp?.();
    });
  }

  private _isValid(): boolean {
    return this._draggableDataContext.draggableItems.some((x) =>
      x instanceof FNodeRotateDragHandler,
    );
  }
}
