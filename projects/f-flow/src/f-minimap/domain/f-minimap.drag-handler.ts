import { IPoint, IRect, Point } from '@foblex/2d';
import { FComponentsStore } from '../../f-storage';
import { IFDragHandler } from '../../f-draggable';
import { FMediator } from '@foblex/mediator';
import { CalculateFlowPointFromMinimapPointRequest } from './calculate-flow-point-from-minimap-point';
import { FMinimapData } from './f-minimap-data';

export class FMinimapDragHandler implements IFDragHandler {
  public fEventType = 'minimap';

  private _lastDifference: IPoint | null = null;

  constructor(
    private readonly _store: FComponentsStore,
    private readonly _mediator: FMediator,
    private readonly _flowRect: IRect,
    private readonly _canvasPosition: IPoint,
    private readonly _eventPoint: IPoint,
    private readonly _minimap: FMinimapData,
  ) {}

  public prepareDragSequence(): void {
    this._store.fCanvas?.hostElement.classList.add('f-scaled-animate');
  }

  public onPointerMove(difference: IPoint): void {
    if (this._lastDifference && this._isSamePoint(difference, this._lastDifference)) {
      return;
    }

    this._lastDifference = difference;
    this._store.fCanvas?.setPosition(
      this._getNewPosition(Point.fromPoint(this._eventPoint).add(difference)),
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
        this._canvasPosition,
        eventPoint,
        this._minimap,
      ),
    );
  }

  public onPointerUp(): void {
    this._store.fCanvas?.hostElement.classList.remove('f-scaled-animate');
    this._store.fCanvas?.emitCanvasChangeEvent();
  }
}
