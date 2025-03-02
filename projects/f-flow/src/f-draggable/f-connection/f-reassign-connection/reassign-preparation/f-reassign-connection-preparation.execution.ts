import { inject, Injectable } from '@angular/core';
import { FReassignConnectionPreparationRequest } from './f-reassign-connection-preparation.request';
import { IPoint, ITransformModel, Point } from '@foblex/2d';
import { FComponentsStore } from '../../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { isValidEventTrigger, UpdateItemAndChildrenLayersRequest } from '../../../../domain';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FConnectionBase } from '../../../../f-connection';
import { FReassignConnectionDragHandler } from '../f-reassign-connection.drag-handler';

@Injectable()
@FExecutionRegister(FReassignConnectionPreparationRequest)
export class FReassignConnectionPreparationExecution implements IExecution<FReassignConnectionPreparationRequest, void> {

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

  public handle(request: FReassignConnectionPreparationRequest): void {
    if (!this._isValid(request) || !this._isValidTrigger(request)) {
      return;
    }

    this._fDraggableDataContext.onPointerDownScale = this._transform.scale;
    this._fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost).div(this._transform.scale);
    this._fDraggableDataContext.draggableItems = [
      new FReassignConnectionDragHandler(this._fConnection!)
    ];

    setTimeout(() => this._updateConnectionLayer());
  }

  private _isValid(request: FReassignConnectionPreparationRequest): boolean {
    this._fConnection = this._getConnectionToReassign(this._getPointInFlow(request));
    return !!this._fConnection && !this._fDraggableDataContext.draggableItems.length;
  }

  private _isValidTrigger(request: FReassignConnectionPreparationRequest): boolean {
    return isValidEventTrigger(request.event.originalEvent, request.fTrigger);
  }

  private _getPointInFlow(request: FReassignConnectionPreparationRequest): IPoint {
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
      return x.fDragHandle?.point && this._isPointInsideCircle(position, x.fDragHandle.point) && !x.fDraggingDisabled;
    });
  }

  private _isPointInsideCircle(point: IPoint, circleCenter: IPoint): boolean {
    return (point.x - circleCenter.x) ** 2 + (point.y - circleCenter.y) ** 2 <= 8 ** 2;
  }

  private _updateConnectionLayer(): void {
    this._fMediator.execute<void>(
      new UpdateItemAndChildrenLayersRequest(
        this._fConnection!, this._fComponentsStore.fCanvas!.fConnectionsContainer().nativeElement
      )
    );
  }
}
