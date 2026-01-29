import { inject, Injectable, Injector } from '@angular/core';
import { MoveConnectionWaypointPreparationRequest } from './move-connection-waypoint-preparation-request';
import { IPoint, ITransformModel, Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { MoveConnectionWaypointHandler } from '../move-connection-waypoint-handler';
import { FComponentsStore } from '../../../../f-storage';
import { FDraggableDataContext } from '../../../../f-draggable';
import { isValidEventTrigger, UpdateItemAndChildrenLayersRequest } from '../../../../domain';
import { FCanvasBase } from '../../../../f-canvas';
import { calculatePointerInFlow } from '../../../../utils';
import { FConnectionBase, pickWaypoint } from '../../../../f-connection-v2';

@Injectable()
@FExecutionRegister(MoveConnectionWaypointPreparationRequest)
export class MoveConnectionWaypointPreparation
  implements IExecution<MoveConnectionWaypointPreparationRequest, void>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);
  private readonly _injector = inject(Injector);

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

  public handle(request: MoveConnectionWaypointPreparationRequest): void {
    const position = calculatePointerInFlow(request.event, this._flowHost, this._transform);

    const pick = this._pickControlPoint(position);
    if (!pick || !this._isValidTrigger(request)) {
      return;
    }

    this._dragContext.onPointerDownScale = this._transform.scale;
    this._dragContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._flowHost)
      .div(this._transform.scale);
    this._dragContext.draggableItems = [new MoveConnectionWaypointHandler(this._injector, pick)];

    queueMicrotask(() => this._updateConnectionLayer(pick.connection));
  }

  private _pickControlPoint(position: IPoint) {
    if (!this._dragContext.isEmpty()) {
      return undefined;
    }

    return pickWaypoint(this._connections, position);
  }

  private _isValidTrigger(request: MoveConnectionWaypointPreparationRequest): boolean {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }

  private _updateConnectionLayer(connection: FConnectionBase): void {
    this._mediator.execute<void>(
      new UpdateItemAndChildrenLayersRequest(
        connection,
        this._canvas.fConnectionsContainer().nativeElement,
      ),
    );
  }
}
