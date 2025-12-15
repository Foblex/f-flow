import { inject, Injectable, Injector } from '@angular/core';
import { FDragControlPointPreparationRequest } from './f-drag-control-point-preparation.request';
import { IPoint, ITransformModel, Point } from '@foblex/2d';
import { FComponentsStore } from '../../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { isValidEventTrigger, UpdateItemAndChildrenLayersRequest } from '../../../../domain';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FConnectionBase } from '../../../../f-connection';
import { FDragControlPointDragHandler } from '../f-drag-control-point.drag-handler';
import { isPointerInsideControlPoint } from './is-pointer-inside-control-point';

@Injectable()
@FExecutionRegister(FDragControlPointPreparationRequest)
export class FDragControlPointPreparationExecution
  implements IExecution<FDragControlPointPreparationRequest, void>
{
  private readonly _fMediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);
  private readonly _injector = inject(Injector);

  private _fConnection: FConnectionBase | undefined;
  private _controlPointIndex: number = -1;

  private get _transform(): ITransformModel {
    return this._store.fCanvas!.transform;
  }

  private get _fHost(): HTMLElement {
    return this._store.fFlow!.hostElement;
  }

  private get _fConnections(): FConnectionBase[] {
    return this._store.fConnections;
  }

  public handle(request: FDragControlPointPreparationRequest): void {
    const position = this._getPointInFlow(request);
    if (!this._isValid(position) || !this._isValidTrigger(request)) {
      return;
    }

    this._dragContext.onPointerDownScale = this._transform.scale;
    this._dragContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost)
      .div(this._transform.scale);

    this._dragContext.draggableItems = [
      new FDragControlPointDragHandler(
        this._injector,
        this._fConnection!,
        this._controlPointIndex,
      ),
    ];

    setTimeout(() => this._updateConnectionLayer());
  }

  private _isValid(position: IPoint): boolean {
    const result = this._getConnectionWithControlPoint(position);
    this._fConnection = result.connection;
    this._controlPointIndex = result.controlPointIndex;

    return !!this._fConnection && this._controlPointIndex >= 0 && !this._dragContext.draggableItems.length;
  }

  private _isValidTrigger(request: FDragControlPointPreparationRequest): boolean {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }

  private _getPointInFlow(request: FDragControlPointPreparationRequest): IPoint {
    return Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost)
      .sub(this._transform.scaledPosition)
      .sub(this._transform.position)
      .div(this._transform.scale);
  }

  private _getConnectionWithControlPoint(
    position: IPoint,
  ): { connection: FConnectionBase | undefined; controlPointIndex: number } {
    for (const connection of this._fConnections) {
      const result = isPointerInsideControlPoint(connection, position);
      if (result.isInside) {
        return { connection, controlPointIndex: result.controlPointIndex };
      }
    }

    return { connection: undefined, controlPointIndex: -1 };
  }

  private _updateConnectionLayer(): void {
    this._fMediator.execute<void>(
      new UpdateItemAndChildrenLayersRequest(
        this._fConnection!,
        this._store.fCanvas!.fConnectionsContainer().nativeElement,
      ),
    );
  }
}
