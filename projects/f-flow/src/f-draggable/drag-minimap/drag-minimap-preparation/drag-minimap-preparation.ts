import { inject, Injectable } from '@angular/core';
import { DragMinimapPreparationRequest } from './drag-minimap-preparation-request';
import { IPoint, IRect, Point, RectExtensions } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore, INSTANCES } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FCanvasBase } from '../../../f-canvas';
import { DragMinimapHandler } from '../drag-minimap-handler';
import { DragHandlerInjector } from '../../infrastructure';
import { CalculateFlowPointFromMinimapPointRequest } from '../calculate-flow-point-from-minimap-point';
import { FMinimapState } from '../../../domain';
import { IPointerEvent } from '../../../drag-toolkit';

@Injectable()
@FExecutionRegister(DragMinimapPreparationRequest)
export class DragMinimapPreparation implements IExecution<DragMinimapPreparationRequest, void> {
  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);
  private readonly _dragSession = inject(FDraggableDataContext);
  private readonly _dragInjector = inject(DragHandlerInjector);

  private get _canvas(): FCanvasBase {
    return this._store.fCanvas as FCanvasBase;
  }

  private get _flowHost(): HTMLElement {
    return this._store.flowHost;
  }

  public handle({ event }: DragMinimapPreparationRequest): void {
    if (!this._isValid(event)) {
      return;
    }

    const state = this._store.instances.require(INSTANCES.MINIMAP).state;

    const eventPoint = event.getPosition();
    const startCanvasPosition = Point.fromPoint(this._store.transform.position);
    const flowRect = RectExtensions.fromElement(this._flowHost);

    this._canvas.setPosition(this._calculateCanvasPosition(flowRect, eventPoint, state));
    this._canvas.redraw();
    this._canvas.emitCanvasChangeEvent();

    this._dragSession.onPointerDownScale = 1;
    this._dragSession.onPointerDownPosition = Point.fromPoint(eventPoint).elementTransform(
      this._flowHost,
    );

    const handler = this._dragInjector.createInstance(DragMinimapHandler);
    handler.initialize(flowRect, startCanvasPosition, eventPoint, state);

    this._dragSession.draggableItems = [handler];
  }

  private _isValid(event: IPointerEvent): boolean {
    if (!this._dragSession.isEmpty()) {
      return false;
    }

    if (!this._flowHost.contains(event.targetElement)) {
      return false;
    }

    if (!event.targetElement.closest('.f-minimap')) {
      return false;
    }

    if (!this._store.instances.get(INSTANCES.MINIMAP)) {
      return false;
    }

    return true;
  }

  private _calculateCanvasPosition(
    flowRect: IRect,
    eventPoint: IPoint,
    minimap: FMinimapState,
  ): IPoint {
    return this._mediator.execute<IPoint>(
      new CalculateFlowPointFromMinimapPointRequest(
        flowRect,
        Point.fromPoint(this._canvas.transform.position),
        eventPoint,
        minimap,
      ),
    );
  }
}
