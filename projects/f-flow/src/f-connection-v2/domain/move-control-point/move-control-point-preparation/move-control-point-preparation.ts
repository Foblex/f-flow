import { inject, Injectable, Injector } from '@angular/core';
import { MoveControlPointPreparationRequest } from './move-control-point-preparation-request';
import { IPoint, ITransformModel, Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { MoveControlPointHandler } from '../move-control-point-handler';
import { isExistingControlPoint } from './is-existing-control-point';
import { FComponentsStore } from '../../../../f-storage';
import { FDraggableDataContext } from '../../../../f-draggable';
import { FConnectionBase } from '../../../../f-connection';
import { isValidEventTrigger, UpdateItemAndChildrenLayersRequest } from '../../../../domain';
import { FCanvasBase } from '../../../../f-canvas';
import { calculatePointerInFlow } from '../../../../utils';

@Injectable()
@FExecutionRegister(MoveControlPointPreparationRequest)
export class MoveControlPointPreparation
  implements IExecution<MoveControlPointPreparationRequest, void>
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
    return this._store.fConnections;
  }

  public handle(request: MoveControlPointPreparationRequest): void {
    const position = calculatePointerInFlow(request.event, this._flowHost, this._transform);

    if (!this._isValid(position) || !this._isValidTrigger(request)) {
      return;
    }

    this._dragContext.onPointerDownScale = this._transform.scale;
    this._dragContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._flowHost)
      .div(this._transform.scale);

    this._dragContext.draggableItems = [
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      new MoveControlPointHandler(this._injector, this._connection!, position),
    ];

    setTimeout(() => this._updateConnectionLayer());
  }

  private _isValid(position: IPoint): boolean {
    return this._dragContext.isEmpty() && !!this._calculateConnectionsFromPoint(position);
  }

  private _calculateConnectionsFromPoint(position: IPoint): FConnectionBase | undefined {
    this._connection = this._connections.find((x) => isExistingControlPoint(x, position));

    return this._connection;
  }

  private _isValidTrigger(request: MoveControlPointPreparationRequest): boolean {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }

  private _updateConnectionLayer(): void {
    this._mediator.execute<void>(
      new UpdateItemAndChildrenLayersRequest(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this._connection!,
        this._canvas.fConnectionsContainer().nativeElement,
      ),
    );
  }
}
