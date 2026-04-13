import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { SetZoomRequest } from './set-zoom-request';
import { FComponentsStore, INSTANCES } from '../../../f-storage';
import { IPoint, Point } from '@foblex/2d';
import { FCanvasBase } from '../../../f-canvas';
import { FZoomBase } from '../../../f-zoom';
import { IsDragStartedRequest } from '../../f-draggable';
import { FDraggableDataContext } from '../../../f-draggable';

const DRAG_KINDS_WITH_REBASE = new Set([
  'drag-node',
  'drag-external-item',
  'resize-node',
  'rotate-node',
  'create-connection',
  'reassign-connection',
  'drag-connection-waypoint',
  'assign-to-container',
]);
const DRAG_KINDS_WITHOUT_REBASE = new Set(['drag-canvas', 'selection-area']);

/**
 * Execution that sets the zoom level of the FCanvas based on the provided request.
 * It adjusts the zoom level by a specified step and direction, ensuring it stays within defined limits.
 */
@Injectable()
@FExecutionRegister(SetZoomRequest)
export class SetZoom implements IExecution<SetZoomRequest, void> {
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext, { optional: true });

  private get _flowHost(): HTMLElement {
    return this._store.flowHost;
  }

  private get _canvas(): FCanvasBase {
    return this._store.fCanvas as FCanvasBase;
  }

  private get _zoomComponent(): FZoomBase | undefined {
    return this._store.instances.get(INSTANCES.ZOOM);
  }

  private get _isDragStarted(): boolean {
    return this._mediator.execute<boolean>(new IsDragStartedRequest());
  }

  public handle(request: SetZoomRequest): void {
    if (!this._zoomComponent) {
      return;
    }
    const currentScale = this._canvas.transform.scale;
    const nextScale = this._clamp(currentScale + request.step * request.direction);
    if (nextScale === currentScale) {
      return;
    }

    const positionInFlowHost = this._castPositionToFlow(request.position);
    if (this._isDragStarted) {
      const mode = this._getDragZoomMode();
      if (mode === 'blocked') {
        return;
      }

      if (mode === 'rebase') {
        this._rebaseDragContext(positionInFlowHost, nextScale);
      }
    }

    this._canvas.setScale(nextScale, positionInFlowHost);
    request.animate ? this._canvas.redrawWithAnimation() : this._canvas.redraw();
    this._canvas.emitCanvasChangeEvent();
  }

  private _clamp(value: number): number {
    return Math.max(
      this._zoomComponent?.minimum || 1,
      Math.min(value, this._zoomComponent?.maximum || 1),
    );
  }

  private _castPositionToFlow(position: IPoint): IPoint {
    return Point.fromPoint(position).elementTransform(this._flowHost);
  }

  private _getDragZoomMode(): 'blocked' | 'rebase' | 'direct' {
    if (this._dragContext?.isEmpty()) {
      return 'blocked';
    }

    let shouldRebase = false;

    for (const handler of this._dragContext?.draggableItems ?? []) {
      const kind = handler.getEvent().kind;
      if (DRAG_KINDS_WITH_REBASE.has(kind)) {
        shouldRebase = true;
        continue;
      }
      if (DRAG_KINDS_WITHOUT_REBASE.has(kind)) {
        continue;
      }

      return 'blocked';
    }

    return shouldRebase ? 'rebase' : 'direct';
  }

  private _rebaseDragContext(positionInFlowHost: IPoint, nextScale: number): void {
    if (!this._dragContext) {
      return;
    }
    const pointerDownScale = this._dragContext.onPointerDownScale;
    if (!pointerDownScale || pointerDownScale === nextScale) {
      this._dragContext.onPointerDownScale = nextScale;

      return;
    }

    const scaleDelta = 1 / nextScale - 1 / pointerDownScale;
    this._dragContext.onPointerDownPosition = Point.fromPoint(
      this._dragContext.onPointerDownPosition,
    ).add(Point.fromPoint(positionInFlowHost).mult(scaleDelta));
    this._dragContext.onPointerDownScale = nextScale;
  }
}
