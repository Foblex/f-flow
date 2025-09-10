import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { OnPointerMoveRequest } from './on-pointer-move-request';
import { FDraggableDataContext } from '../../../f-draggable';
import { IPoint, Point } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { IPointerEvent } from "../../../drag-toolkit";

/**
 * Execution that handles pointer move events during a drag operation.
 * It calculates the difference between the current pointer position and the position
 * when the drag started, and updates the draggable items accordingly.
 */
@Injectable()
@FExecutionRegister(OnPointerMoveRequest)
export class OnPointerMoveExecution implements IExecution<OnPointerMoveRequest, void> {

  private readonly _store = inject(FComponentsStore);

  private get _hostElement(): HTMLElement {
    return this._store.fDraggable!.hostElement;
  }

  private readonly _dragContext = inject(FDraggableDataContext);

  public handle(request: OnPointerMoveRequest): void {
    this._setDifferenceToDraggableItems(
      this._getDifferenceBetweenPointerAndPointerDown(request.event),
    );
  }

  private _setDifferenceToDraggableItems(difference: IPoint): void {
    this._dragContext.draggableItems.forEach((item) => {
      item.onPointerMove({ ...difference });
    });
  }

  private _getDifferenceBetweenPointerAndPointerDown(event: IPointerEvent): IPoint {
    return this._getPointerPositionInCanvas(event)
      .div(this._dragContext.onPointerDownScale)
      .sub(this._dragContext.onPointerDownPosition);
  }

  private _getPointerPositionInCanvas(event: IPointerEvent): Point {
    return Point.fromPoint(event.getPosition()).elementTransform(this._hostElement);
  }
}
