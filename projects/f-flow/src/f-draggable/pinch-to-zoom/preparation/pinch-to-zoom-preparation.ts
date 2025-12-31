import { inject, Injectable, Injector } from '@angular/core';
import { PinchToZoomPreparationRequest } from './pinch-to-zoom-preparation-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { IPointerEvent } from '../../../drag-toolkit';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { Point } from '@foblex/2d';
import { PinchToZoomHandler } from '../pinch-to-zoom-handler';
import { FComponentsStore } from '../../../f-storage';
import { F_ZOOM_TAG } from '../../../domain';

@Injectable()
@FExecutionRegister(PinchToZoomPreparationRequest)
export class PinchToZoomPreparation implements IExecution<PinchToZoomPreparationRequest, void> {
  private readonly _injector = inject(Injector);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  public handle({ event }: PinchToZoomPreparationRequest): void {
    if (!this._isValid(event)) {
      return;
    }

    this._dragContext.onPointerDownScale = 1;
    this._dragContext.onPointerDownPosition = new Point();

    this._dragContext.draggableItems = [new PinchToZoomHandler(this._injector, event.touches)];
  }

  private _isValid(event: IPointerEvent): boolean {
    return (
      this._dragContext.isEmpty() &&
      event.touches?.length === 2 &&
      !event.isEventInLockedContext &&
      this._isZoomComponent()
    );
  }

  private _isZoomComponent(): boolean {
    return !!this._store.fComponents[F_ZOOM_TAG];
  }
}
