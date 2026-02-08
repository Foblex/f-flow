import { inject, Injectable } from '@angular/core';
import { PinchToZoomPreparationRequest } from './pinch-to-zoom-preparation-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { IPointerEvent } from '../../../drag-toolkit';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { Point } from '@foblex/2d';
import { FComponentsStore } from '../../../f-storage';
import { F_ZOOM_TAG } from '../../../domain';
import { PinchToZoomHandler } from '../handler';
import { DragHandlerInjector } from '../../infrastructure';

@Injectable()
@FExecutionRegister(PinchToZoomPreparationRequest)
export class PinchToZoomPreparation implements IExecution<PinchToZoomPreparationRequest, void> {
  private readonly _dragInjector = inject(DragHandlerInjector);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragSession = inject(FDraggableDataContext);

  public handle({ event }: PinchToZoomPreparationRequest): void {
    if (!this._canStart(event)) {
      return;
    }

    this._dragSession.onPointerDownScale = 1;
    this._dragSession.onPointerDownPosition = new Point();
    this._dragSession.draggableItems = [this._getHandler(event)];
  }

  private _canStart(event: IPointerEvent): boolean {
    return (
      this._dragSession.isEmpty() &&
      event.touches?.length === 2 &&
      !event.isEventInLockedContext &&
      this._hasZoomComponent()
    );
  }

  private _hasZoomComponent(): boolean {
    return !!this._store.fComponents[F_ZOOM_TAG];
  }

  private _getHandler(event: IPointerEvent): PinchToZoomHandler {
    const handler = this._dragInjector.get(PinchToZoomHandler);
    handler.initialize(event.touches);

    return handler;
  }
}
