import { IPoint, IRect, Point } from '@foblex/2d';
import { DragHandlerBase } from '../../infrastructure';
import { FComponentsStore } from '../../../f-storage';
import { FMediator } from '@foblex/mediator';
import { DRAG_MINIMAP_HANDLER_KIND, DRAG_MINIMAP_HANDLER_TYPE } from '../is-drag-minimap-handler';
import { inject, Injectable } from '@angular/core';
import { CalculateFlowPointFromMinimapPointRequest } from '../calculate-flow-point-from-minimap-point';
import { FMinimapState } from '../../../domain';

@Injectable()
export class DragMinimapHandler extends DragHandlerBase<unknown> {
  protected readonly type = DRAG_MINIMAP_HANDLER_TYPE;
  protected readonly kind = DRAG_MINIMAP_HANDLER_KIND;

  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);

  private _lastDelta: IPoint | null = null;

  private _flowRect!: IRect;
  private _startCanvasPosition!: IPoint;
  private _eventPoint!: IPoint;
  private _minimap!: FMinimapState;

  public initialize(
    flowRect: IRect,
    startCanvasPosition: IPoint,
    eventPoint: IPoint,
    minimap: FMinimapState,
  ): void {
    this._flowRect = flowRect;
    this._startCanvasPosition = startCanvasPosition;
    this._eventPoint = eventPoint;
    this._minimap = minimap;
  }

  public override prepareDragSequence(): void {
    this._store.fCanvas?.hostElement.classList.add('f-scaled-animate');
  }

  public override onPointerMove(delta: IPoint): void {
    if (this._lastDelta && this._isSamePoint(delta, this._lastDelta)) {
      return;
    }

    this._lastDelta = delta;
    this._store.fCanvas?.setPosition(
      this._getNewPosition(Point.fromPoint(this._eventPoint).add(delta)),
    );
    this._store.fCanvas?.redraw();
  }

  private _isSamePoint(point1: IPoint, point2: IPoint): boolean {
    return point1.x === point2.x && point1.y === point2.y;
  }

  private _getNewPosition(eventPoint: IPoint): IPoint {
    return this._mediator.execute<IPoint>(
      new CalculateFlowPointFromMinimapPointRequest(
        this._flowRect,
        this._startCanvasPosition,
        eventPoint,
        this._minimap,
      ),
    );
  }

  public override onPointerUp(): void {
    this._store.fCanvas?.hostElement.classList.remove('f-scaled-animate');
    this._store.fCanvas?.emitCanvasChangeEvent();
  }
}
