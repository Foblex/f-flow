import { inject, Injectable } from '@angular/core';
import { RotateNodeFinalizeRequest } from './rotate-node-finalize-request';
import { IExecution } from '../../../_libs/f-mediator';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { isRotateNodeHandler } from '../is-rotate-node-handler';

@Injectable()
export class RotateNodeFinalize implements IExecution<RotateNodeFinalizeRequest, void> {
  private readonly _dragSession = inject(FDraggableDataContext);

  public handle(_request: RotateNodeFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    this._dragSession.draggableItems.forEach((x) => {
      x.onPointerUp?.();
    });
  }

  private _isValid(): boolean {
    return this._dragSession.draggableItems.some((x) => isRotateNodeHandler(x));
  }
}
