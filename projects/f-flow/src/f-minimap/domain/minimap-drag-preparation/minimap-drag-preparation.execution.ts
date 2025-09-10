import { inject, Injectable } from '@angular/core';
import { MinimapDragPreparationRequest } from './minimap-drag-preparation.request';
import { IPoint, IRect, Point, RectExtensions } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FMinimapDragHandler } from '../f-minimap.drag-handler';
import { FDraggableDataContext } from '../../../f-draggable';
import { CalculateFlowPointFromMinimapPointRequest } from '../calculate-flow-point-from-minimap-point';
import { FMinimapData } from '../f-minimap-data';

@Injectable()
@FExecutionRegister(MinimapDragPreparationRequest)
export class MinimapDragPreparationExecution
  implements IExecution<MinimapDragPreparationRequest, void>
{
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);
  private readonly _draggableDataContext = inject(FDraggableDataContext);

  private get _flowHost(): HTMLElement {
    return this._store.fFlow!.hostElement;
  }

  public handle(request: MinimapDragPreparationRequest): void {
    if (!this._isValid(request)) {
      return;
    }
    const eventPoint = request.event.getPosition();
    const startCanvasPosition = Point.fromPoint(this._store.fCanvas!.transform.position);

    this._store.fCanvas!.setPosition(this._getNewPosition(eventPoint, request.minimap));
    this._store.fCanvas!.redraw();
    this._store.fCanvas!.emitCanvasChangeEvent();

    this._draggableDataContext.onPointerDownScale = 1;
    this._draggableDataContext.onPointerDownPosition = Point.fromPoint(eventPoint).elementTransform(
      this._flowHost,
    );
    this._draggableDataContext.draggableItems = [
      new FMinimapDragHandler(
        this._store,
        this._mediator,
        this._getFlowRect(),
        startCanvasPosition,
        eventPoint,
        request.minimap,
      ),
    ];
  }

  private _isValid(request: MinimapDragPreparationRequest): boolean {
    return (
      !this._draggableDataContext.draggableItems.length &&
      !!request.event.targetElement.closest('.f-minimap') &&
      this._store.flowHost.contains(request.event.targetElement)
    );
  }

  private _getNewPosition(eventPoint: IPoint, minimap: FMinimapData): IPoint {
    return this._mediator.execute<IPoint>(
      new CalculateFlowPointFromMinimapPointRequest(
        this._getFlowRect(),
        Point.fromPoint(this._store.fCanvas!.transform.position),
        eventPoint,
        minimap,
      ),
    );
  }

  private _getFlowRect(): IRect {
    return RectExtensions.fromElement(this._flowHost);
  }
}
