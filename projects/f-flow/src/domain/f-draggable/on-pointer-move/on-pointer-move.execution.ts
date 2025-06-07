import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { OnPointerMoveRequest } from './on-pointer-move-request';
import { FDraggableDataContext } from '../../../f-draggable';
import { IPoint, Point } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import {IPointerEvent} from "../../../drag-toolkit";

@Injectable()
@FExecutionRegister(OnPointerMoveRequest)
export class OnPointerMoveExecution implements IExecution<OnPointerMoveRequest, void> {

  private readonly _fComponentsStore = inject(FComponentsStore);

  private get _hostElement(): HTMLElement {
    return this._fComponentsStore.fDraggable!.hostElement;
  }

  private _fDraggableDataContext = inject(FDraggableDataContext);

  public handle(request: OnPointerMoveRequest): void {
    this._setDifferenceToDraggableItems(
      this._getDifferenceBetweenPointerAndPointerDown(request.event)
    );
  }

  private _setDifferenceToDraggableItems(difference: IPoint): void {
    this._fDraggableDataContext.draggableItems.forEach((item) => {
      item.onPointerMove({ ...difference });
    });
  }

  private _getDifferenceBetweenPointerAndPointerDown(event: IPointerEvent): IPoint {
    return this._getPointerPositionInCanvas(event)
      .div(this._fDraggableDataContext.onPointerDownScale)
      .sub(this._fDraggableDataContext.onPointerDownPosition);
  }

  private _getPointerPositionInCanvas(event: IPointerEvent): Point {
    return Point.fromPoint(event.getPosition()).elementTransform(this._hostElement);
  }
}
