import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IPoint, PointExtensions } from '@foblex/2d';
import { ScheduleAutoPanFrameRequest } from './schedule-auto-pan-frame-request';
import { StopAutoPanRequest } from '../stop-auto-pan';
import { RunAutoPanFrameRequest } from '../run-auto-pan-frame';
import { FComponentsStore, INSTANCES } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { calculateAutoPanDelta, resolveAutoPanMode } from '../auto-pan.utils';

@Injectable()
@FExecutionRegister(ScheduleAutoPanFrameRequest)
export class ScheduleAutoPanFrame implements IExecution<ScheduleAutoPanFrameRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  public handle(_request: ScheduleAutoPanFrameRequest): void {
    if (!this._canAutoPan() || !this._hasAutoPanDelta()) {
      this._mediator.execute<void>(new StopAutoPanRequest());

      return;
    }

    if (this._dragContext.autoPanFrameId !== null) {
      return;
    }

    this._dragContext.autoPanFrameId = requestAnimationFrame(() => {
      this._dragContext.autoPanFrameId = null;
      this._mediator.execute<void>(new RunAutoPanFrameRequest());
    });
  }

  private _canAutoPan(): boolean {
    return (
      !!this._store.fFlow &&
      !!this._store.fCanvas &&
      !!this._store.fDraggable?.isDragStarted &&
      !!this._autoPan() &&
      !!this._getAutoPanMode() &&
      this._edgeThreshold() > 0 &&
      this._speed() > 0
    );
  }

  private _hasAutoPanDelta(): boolean {
    const delta = this._getAutoPanDelta();

    return !!delta.x || !!delta.y;
  }

  private _getAutoPanDelta(): IPoint {
    const pointerPosition = this._dragContext.lastPointerPosition;
    const flowHost = this._store.fFlow?.hostElement;

    if (!pointerPosition || !flowHost) {
      return PointExtensions.initialize();
    }

    return calculateAutoPanDelta(
      pointerPosition,
      flowHost.getBoundingClientRect(),
      this._edgeThreshold(),
      this._speed(),
      this._acceleration(),
    );
  }

  private _getAutoPanMode() {
    return resolveAutoPanMode(this._dragContext.draggableItems.map((x) => x.getEvent().kind));
  }

  private _edgeThreshold(): number {
    return Math.max(0, this._autoPan()?.fEdgeThreshold() ?? 0);
  }

  private _speed(): number {
    return Math.max(0, this._autoPan()?.fSpeed() ?? 0);
  }

  private _acceleration(): boolean {
    return !!this._autoPan()?.fAcceleration();
  }

  private _autoPan() {
    return this._store.instances.get(INSTANCES.AUTO_PAN);
  }
}
