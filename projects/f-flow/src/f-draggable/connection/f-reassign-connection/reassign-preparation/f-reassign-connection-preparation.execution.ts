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

  private _connection: FConnectionBase | undefined;

  private get _canvas(): FCanvasBase {
    return this._store.fCanvas as FCanvasBase;
  }

  private get _transform(): ITransformModel {
    return this._canvas.transform as ITransformModel;
  }

  private get _flowHost(): HTMLElement {
    return this._store.flowHost;
  }

  private get _connections(): FConnectionBase[] {
    return this._store.connections.getAll<FConnectionBase>();
  }

  public handle(request: FReassignConnectionPreparationRequest): void {
    const position = calculatePointerInFlow(request.event, this._flowHost, this._transform);

    if (!this._isValid(position) || !this._isValidTrigger(request)) {
      return;
    }

    this._dragContext.onPointerDownScale = this._transform.scale;
    this._dragContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._flowHost)
      .div(this._transform.scale);

    this._dragContext.draggableItems = [
      new FReassignConnectionDragHandler(
        this._injector,
        this._connection!,
        isDragHandleEnd(this._connection!, position),
      ),
    ];

    setTimeout(() => this._updateConnectionLayer());
  }

  private _isValid(position: IPoint): boolean {
    return this._dragContext.isEmpty() && !!this._calculateConnectionsFromPoint(position);
  }

  private _calculateConnectionsFromPoint(position: IPoint): FConnectionBase | undefined {
    this._connection = this._connections.find((x) =>
      isPointerInsideStartOrEndDragHandles(x, position),
    );

    return this._connection;
  }

  private _isValidTrigger(request: FReassignConnectionPreparationRequest): boolean {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }

  private _updateConnectionLayer(): void {
    this._mediator.execute<void>(
      new UpdateItemAndChildrenLayersRequest(
        this._connection!,
        this._canvas.fConnectionsContainer().nativeElement,
      ),
    );
  }
}
