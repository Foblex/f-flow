import { inject, Injectable, Injector } from '@angular/core';
import { FReassignConnectionPreparationRequest } from './f-reassign-connection-preparation.request';
import { IPoint, ITransformModel, Point } from '@foblex/2d';
import { FComponentsStore } from '../../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { isValidEventTrigger, UpdateItemAndChildrenLayersRequest } from '../../../../domain';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FConnectionBase } from '../../../../f-connection';
import { FReassignConnectionDragHandler } from '../f-reassign-connection.drag-handler';
import {
  isDragHandleEnd,
  isPointerInsideStartOrEndDragHandles,
} from "./is-pointer-inside-start-or-end-drag-handles";

@Injectable()
@FExecutionRegister(FReassignConnectionPreparationRequest)
export class FReassignConnectionPreparationExecution implements IExecution<FReassignConnectionPreparationRequest, void> {

  private readonly _fMediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);
  private readonly _injector = inject(Injector);

  private _fConnection: FConnectionBase | undefined;

  private get _transform(): ITransformModel {
    return this._store.fCanvas!.transform;
  }

  private get _fHost(): HTMLElement {
    return this._store.fFlow!.hostElement;
  }

  private get _fConnections(): FConnectionBase[] {
    return this._store.fConnections;
  }

  public handle(request: FReassignConnectionPreparationRequest): void {
    const position = this._getPointInFlow(request);
    if (!this._isValid(position) || !this._isValidTrigger(request)) {
      return;
    }

    this._dragContext.onPointerDownScale = this._transform.scale;
    this._dragContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this._fHost).div(this._transform.scale);

    this._dragContext.draggableItems = [
      new FReassignConnectionDragHandler(
        this._injector, this._fConnection!, isDragHandleEnd(this._fConnection!, position),
      ),
    ];

    setTimeout(() => this._updateConnectionLayer());
  }

  private _isValid(position: IPoint): boolean {
    this._fConnection = this._getConnectionToReassign(position);

    return !!this._fConnection && !this._dragContext.draggableItems.length;
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
    return this._fConnections.filter((x) => isPointerInsideStartOrEndDragHandles(x, position));
  }

  private _updateConnectionLayer(): void {
    this._fMediator.execute<void>(
      new UpdateItemAndChildrenLayersRequest(
        this._fConnection!, this._store.fCanvas!.fConnectionsContainer().nativeElement,
      ),
    );
  }
}
