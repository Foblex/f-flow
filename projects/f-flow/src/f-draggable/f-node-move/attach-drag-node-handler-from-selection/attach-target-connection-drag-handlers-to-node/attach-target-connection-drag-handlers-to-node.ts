import { inject, Injectable } from '@angular/core';
import { AttachTargetConnectionDragHandlersToNodeRequest } from './attach-target-connection-drag-handlers-to-node-request';
import { FComponentsStore } from '../../../../f-storage';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../../f-node';
import {
  DragNodeConnectionBothSidesHandler,
  DragNodeConnectionHandlerBase,
  DragNodeConnectionTargetHandler,
} from '../../drag-node-dependent-connection-handlers';
import { FConnectionBase } from '../../../../f-connection-v2';
import { DragHandlerInjector } from '../../../infrastructure';

@Injectable()
@FExecutionRegister(AttachTargetConnectionDragHandlersToNodeRequest)
export class AttachTargetConnectionDragHandlersToNode
  implements IExecution<AttachTargetConnectionDragHandlersToNodeRequest, void>
{
  private readonly _store = inject(FComponentsStore);
  private readonly _dragInjector = inject(DragHandlerInjector);

  private get _connections(): FConnectionBase[] {
    return this._store.connections.getAll();
  }

  public handle(request: AttachTargetConnectionDragHandlersToNodeRequest): void {
    this._getInputConnections(request.dragHandler.nodeOrGroup).forEach((connection) => {
      this._createAndSetConnectionToNodeHandler(connection, request);
    });
  }

  private _getInputConnections(nodeOrGroup: FNodeBase): FConnectionBase[] {
    const ids = new Set(this._getNodeInputIds(nodeOrGroup));

    return this._connections.filter((x) => ids.has(x.fInputId()));
  }

  private _getNodeInputIds(nodeOrGroup: FNodeBase): string[] {
    return this._store.inputs
      .getAll()
      .filter((x) => nodeOrGroup.isContains(x.hostElement))
      .map((x) => x.fId());
  }

  private _createAndSetConnectionToNodeHandler(
    connection: FConnectionBase,
    request: AttachTargetConnectionDragHandlersToNodeRequest,
  ): void {
    let connectionHandler = this._getExistingConnectionHandler(request.handlerPool, connection);
    if (!connectionHandler) {
      connectionHandler = this._createConnectionHandler(request.sourceIds, connection);
      request.handlerPool.push(connectionHandler);
    }
    request.dragHandler.fTargetHandlers.push(connectionHandler);
  }

  private _getExistingConnectionHandler(
    existingConnectionHandlers: DragNodeConnectionHandlerBase[],
    connection: FConnectionBase,
  ): DragNodeConnectionHandlerBase | undefined {
    return existingConnectionHandlers.find((x) => x.connection.fId() === connection.fId());
  }

  private _createConnectionHandler(
    outputIds: string[],
    connection: FConnectionBase,
  ): DragNodeConnectionHandlerBase {
    let result: DragNodeConnectionHandlerBase | undefined;
    if (outputIds.includes(connection.fOutputId())) {
      result = this._dragInjector.createInstance(DragNodeConnectionBothSidesHandler);
    } else {
      result = this._dragInjector.createInstance(DragNodeConnectionTargetHandler);
    }
    result.initialize(connection);

    return result;
  }
}
