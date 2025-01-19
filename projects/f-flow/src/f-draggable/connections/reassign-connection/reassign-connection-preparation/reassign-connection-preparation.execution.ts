import { inject, Injectable } from '@angular/core';
import { ReassignConnectionPreparationRequest } from './reassign-connection-preparation.request';
import { IPoint, ITransformModel, Point, PointExtensions } from '@foblex/2d';
import { FComponentsStore } from '../../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { UpdateItemAndChildrenLayersRequest } from '../../../../domain';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FConnectionBase } from '../../../../f-connection';
import { ReassignConnectionDragHandler } from '../reassign-connection.drag-handler';

@Injectable()
@FExecutionRegister(ReassignConnectionPreparationRequest)
export class ReassignConnectionPreparationExecution implements IExecution<ReassignConnectionPreparationRequest, void> {

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);
  private _fDraggableDataContext = inject(FDraggableDataContext);

  private _fConnection: FConnectionBase | undefined;

  private get _transform(): ITransformModel {
    return this._fComponentsStore.fCanvas!.transform;
  }

  private get _fHost(): HTMLElement {
    return this._fComponentsStore.fFlow!.hostElement;
  }

  private get _fConnections(): FConnectionBase[] {
    return this._fComponentsStore.fConnections;
  }

  public handle(request: ReassignConnectionPreparationRequest): void {
    if (!this._isValid(request)) {
      return;
    }

    this._fDraggableDataContext.onPointerDownScale = this._transform.scale;
    this._fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost).div(this._transform.scale);
    this._fDraggableDataContext.draggableItems = [
      new ReassignConnectionDragHandler(this._fMediator, this._fComponentsStore, this._fConnection!)
    ];

    setTimeout(() => this._updateConnectionLayer());
  }

  private _isValid(request: ReassignConnectionPreparationRequest): boolean {
    this._fConnection = this._getConnectionToReassign(this._getPointInFlow(request));
    return !!this._fConnection && !this._fDraggableDataContext.draggableItems.length;
  }

  private _getPointInFlow(request: ReassignConnectionPreparationRequest): IPoint {
    return Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost)
      .sub(this._transform.scaledPosition).sub(this._transform.position)
      .div(this._transform.scale);
  }

  private _getConnectionToReassign(position: IPoint): FConnectionBase | undefined {
    const connections = this._getConnectionsFromPoint(position);
    return connections.length ? connections[0] : undefined;
  }

  private _getConnectionsFromPoint(position: IPoint): FConnectionBase[] {
    return this._fConnections.filter((x) => {
      return this._isPointInsideCircle(position, x.fDragHandle.point) && !x.fDraggingDisabled;
    });
  }

  private _isPointInsideCircle(point: IPoint, circleCenter: IPoint): boolean {
    return (point.x - circleCenter.x) ** 2 + (point.y - circleCenter.y) ** 2 <= 8 ** 2;
  }

  private _updateConnectionLayer(): void {
    this._fMediator.execute<void>(
      new UpdateItemAndChildrenLayersRequest(
        this._fConnection!, this._fComponentsStore.fCanvas!.fConnectionsContainer.nativeElement
      )
    );
  }
}
