import { inject, Injectable, Injector } from '@angular/core';
import { FReassignConnectionPreparationRequest } from './f-reassign-connection-preparation.request';
import { IPoint, ITransformModel, Point } from '@foblex/2d';
import { FComponentsStore } from '../../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { isValidEventTrigger, UpdateItemAndChildrenLayersRequest } from '../../../../domain';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FReassignConnectionDragHandler } from '../f-reassign-connection.drag-handler';
import {
  isDragHandleEnd,
  isPointerInsideStartOrEndDragHandles,
} from './is-pointer-inside-start-or-end-drag-handles';
import { calculatePointerInFlow } from '../../../../utils';
import { FCanvasBase } from '../../../../f-canvas';
import { FConnectionBase } from '../../../../f-connection-v2';

@Injectable()
@FExecutionRegister(FReassignConnectionPreparationRequest)
export class FReassignConnectionPreparationExecution
  implements IExecution<FReassignConnectionPreparationRequest, void>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);
  private readonly _injector = inject(Injector);

  private get _canvas(): FCanvasBase {
    return this._store.fCanvas as FCanvasBase;
  }

  private get _transform(): ITransformModel {
    return this._store.transform;
  }

  private get _flowHost(): HTMLElement {
    return this._store.flowHost;
  }

  private get _connections(): FConnectionBase[] {
    return this._store.connections.getAll<FConnectionBase>();
  }

  public handle(request: FReassignConnectionPreparationRequest): void {
    if (!this._dragContext.isEmpty() || !this._isValidTrigger(request)) {
      return;
    }

    const pointerInFlow = calculatePointerInFlow(request.event, this._flowHost, this._transform);
    const connection = this._findConnectionAt(pointerInFlow);

    if (!connection) {
      return;
    }

    this._capturePointerDown(request);
    this._startDrag(connection, pointerInFlow);

    queueMicrotask(() => this._bringToFront(connection));
  }

  private _findConnectionAt(pointerInFlow: IPoint): FConnectionBase | undefined {
    return this._connections.find((c) => isPointerInsideStartOrEndDragHandles(c, pointerInFlow));
  }

  private _capturePointerDown(request: FReassignConnectionPreparationRequest): void {
    this._dragContext.onPointerDownScale = this._transform.scale;
    this._dragContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._flowHost)
      .div(this._transform.scale);
  }

  private _startDrag(connection: FConnectionBase, pointerInFlow: IPoint): void {
    const isEndHandle = isDragHandleEnd(connection, pointerInFlow);

    this._dragContext.draggableItems = [
      new FReassignConnectionDragHandler(this._injector, connection, isEndHandle),
    ];
  }

  private _isValidTrigger(request: FReassignConnectionPreparationRequest): boolean {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }

  private _bringToFront(connection: FConnectionBase): void {
    this._mediator.execute<void>(
      new UpdateItemAndChildrenLayersRequest(
        connection,
        this._canvas.fConnectionsContainer().nativeElement,
      ),
    );
  }
}
