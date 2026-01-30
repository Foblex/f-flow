import { inject, Injectable } from '@angular/core';
import { ReassignConnectionFinalizeRequest } from './reassign-connection-finalize-request';
import { FComponentsStore } from '../../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FDraggableBase } from '../../../f-draggable-base';
import { FReassignConnectionEvent } from '../f-reassign-connection-event';
import { FConnectorBase } from '../../../../f-connectors';
import {
  FindConnectableConnectorUsingPriorityAndPositionRequest,
  IConnectorRectRef,
} from '../../../../domain';
import { FDragHandlerResult } from '../../../f-drag-handler';
import { IPointerEvent } from '../../../../drag-toolkit';
import { IReassignConnectionDragResult } from '../i-reassign-connection-drag-result';
import { ReassignConnectionHandler } from '../reassign-connection-handler';

@Injectable()
@FExecutionRegister(ReassignConnectionFinalizeRequest)
export class ReassignConnectionFinalize
  implements IExecution<ReassignConnectionFinalizeRequest, void>
{
  private readonly _dragResult =
    inject<FDragHandlerResult<IReassignConnectionDragResult>>(FDragHandlerResult);
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  private get _dragDirective(): FDraggableBase {
    return this._store.fDraggable as FDraggableBase;
  }

  public handle({ event }: ReassignConnectionFinalizeRequest): void {
    const handler = this._findReassignHandler();
    if (!handler) {
      return;
    }

    this._emitIfChanged(event);
    handler.onPointerUp();
  }

  private _findReassignHandler(): ReassignConnectionHandler | undefined {
    const result = this._dragContext.draggableItems.find(
      (x) => x.getEvent().fEventType === 'reassign-connection',
    );

    return result as ReassignConnectionHandler | undefined;
  }

  private _emitIfChanged(event: IPointerEvent): void {
    const data = this._dragResult.getData();
    const nextConnector = this._findConnectableConnector(event, data.candidates);

    if (nextConnector && !this._isReassignedToDifferentConnector(data, nextConnector)) {
      return;
    }

    this._dragDirective.fReassignConnection.emit(this._buildEvent(data, event, nextConnector));
  }

  private _findConnectableConnector(
    event: IPointerEvent,
    connectable: IConnectorRectRef[],
  ): FConnectorBase | undefined {
    return this._mediator.execute<FConnectorBase | undefined>(
      new FindConnectableConnectorUsingPriorityAndPositionRequest(event.getPosition(), connectable),
    );
  }

  private _isReassignedToDifferentConnector(
    data: IReassignConnectionDragResult,
    next: FConnectorBase,
  ): boolean {
    const connection = data.connection;

    if (data.draggedEnd === 'target') {
      return connection.fInputId() !== next.fId();
    }

    return connection.fOutputId() !== next.fId();
  }

  private _buildEvent(
    data: IReassignConnectionDragResult,
    event: IPointerEvent,
    next?: FConnectorBase,
  ): FReassignConnectionEvent {
    const connection = data.connection;

    return new FReassignConnectionEvent(
      connection.fId(),
      data.draggedEnd,
      connection.fOutputId(),
      data.draggedEnd === 'source' ? next?.fId() : undefined,
      connection.fInputId(),
      data.draggedEnd === 'target' ? next?.fId() : undefined,
      event.getPosition(),
    );
  }
}
