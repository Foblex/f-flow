import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { OnPointerMoveRequest } from './on-pointer-move-request';
import { FDraggableDataContext } from '../../../f-draggable';
import { IPoint, Point } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { IPointerEvent } from '../../../drag-toolkit';
import { SyncAutoPanRequest } from '../../../f-draggable/auto-pan';

/**
 * Execution that handles pointer move events during a drag operation.
 * It calculates the difference between the current pointer position and the position
 * when the drag started, and updates the draggable items accordingly.
 */
@Injectable()
@FExecutionRegister(OnPointerMoveRequest)
export class OnPointerMove implements IExecution<OnPointerMoveRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  private get _hostElement(): HTMLElement {
    return this._store.fDraggable?.hostElement as HTMLElement;
  }

  private readonly _dragContext = inject(FDraggableDataContext);

  public handle({ event }: OnPointerMoveRequest): void {
    this._dragContext.rememberPointerEvent(event);

    this._setDifferenceToDraggableItems(
      this._getDifferenceBetweenPointerAndPointerDown(event),
      event,
    );
    this._mediator.execute<void>(new SyncAutoPanRequest());
  }

  private _setDifferenceToDraggableItems(difference: IPoint, event: IPointerEvent): void {
    this._dragContext.draggableItems.forEach((item) => {
      item.onPointerMove({ ...difference }, event);
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
