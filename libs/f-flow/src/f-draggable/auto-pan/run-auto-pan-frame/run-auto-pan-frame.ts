import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IPoint, Point, PointExtensions } from '@foblex/2d';
import { RunAutoPanFrameRequest } from './run-auto-pan-frame-request';
import { FComponentsStore, INSTANCES } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import {
  calculateAutoPanDelta,
  rebaseAutoPanPointerDownPosition,
  resolveAutoPanMode,
  TAutoPanMode,
} from '../auto-pan.utils';
import { IPointerEvent } from '../../../drag-toolkit';
import { StopAutoPanRequest } from '../stop-auto-pan';
import { SyncAutoPanRequest } from '../sync-auto-pan';

@Injectable()
@FExecutionRegister(RunAutoPanFrameRequest)
export class RunAutoPanFrame implements IExecution<RunAutoPanFrameRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  public handle(_request: RunAutoPanFrameRequest): void {
    const mode = this._getAutoPanMode();
    if (!this._canAutoPan(mode)) {
      this._mediator.execute<void>(new StopAutoPanRequest());

      return;
    }

    const delta = this._getAutoPanDelta();
    if (!delta.x && !delta.y) {
      this._mediator.execute<void>(new StopAutoPanRequest());

      return;
    }

    this._applyCanvasDelta(delta, mode);
    this._replayLastPointerMove();
    this._mediator.execute<void>(new SyncAutoPanRequest());
  }

  private _applyCanvasDelta(delta: IPoint, mode: TAutoPanMode): void {
    const transform = this._store.transform;

    if (mode === 'rebase') {
      this._dragContext.onPointerDownPosition = rebaseAutoPanPointerDownPosition(
        this._dragContext.onPointerDownPosition,
        delta,
        this._dragContext.onPointerDownScale || transform.scale || 1,
      );
    }

    transform.position = Point.fromPoint(transform.position).add(delta);
    this._store.fCanvas?.redraw();
    this._dragContext.isAutoPanCanvasMoved = true;
  }

  private _replayLastPointerMove(): void {
    const event = this._dragContext.lastPointerEvent;
    if (!event) {
      return;
    }

    const difference = this._getPointerPositionInCanvas(event)
      .div(this._dragContext.onPointerDownScale)
      .sub(this._dragContext.onPointerDownPosition);

    this._dragContext.draggableItems.forEach((item) => {
      item.onPointerMove({ ...difference }, event);
    });
  }

  private _getPointerPositionInCanvas(event: IPointerEvent): Point {
    return Point.fromPoint(event.getPosition()).elementTransform(this._store.flowHost);
  }

  private _canAutoPan(mode: TAutoPanMode | null): mode is TAutoPanMode {
    return (
      !!this._store.fFlow &&
      !!this._store.fCanvas &&
      !!this._store.fDraggable?.isDragStarted &&
      !!this._autoPan() &&
      !!mode &&
      this._edgeThreshold() > 0 &&
      this._speed() > 0
    );
  }

  private _getAutoPanMode(): TAutoPanMode | null {
    return resolveAutoPanMode(this._dragContext.draggableItems.map((x) => x.getEvent().kind));
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
