import { inject, Injectable } from '@angular/core';
import { AttachSourceConnectionDragHandlersToNodeRequest } from './attach-source-connection-drag-handlers-to-node-request';
import { FComponentsStore } from '../../../../f-storage';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../../f-node';
import {
  DragNodeConnectionBothSidesHandler,
  DragNodeConnectionHandlerBase,
  DragNodeConnectionSourceHandler,
} from '../../drag-node-dependent-connection-handlers';
import { FConnectionBase } from '../../../../f-connection-v2';
import { DragHandlerInjector } from '../../../infrastructure';

@Injectable()
@FExecutionRegister(AttachSourceConnectionDragHandlersToNodeRequest)
export class AttachSourceConnectionDragHandlersToNode
  implements IExecution<AttachSourceConnectionDragHandlersToNodeRequest, void>
{
  private readonly _store = inject(FComponentsStore);
  private readonly _dragInjector = inject(DragHandlerInjector);

  private get _connections(): FConnectionBase[] {
    return this._store.connections.getAll();
  }

  public handle(request: AttachSourceConnectionDragHandlersToNodeRequest): void {
    this._getOutputConnections(request.dragHandler.nodeOrGroup).forEach((fConnection) => {
      this._createAndSetConnectionToNodeHandler(fConnection, request);
    });
  }

  public _getOutputConnections(nodeOrGroup: FNodeBase): FConnectionBase[] {
    const ids = new Set(this._getNodeOutputIds(nodeOrGroup));

    return this._connections.filter((x) => ids.has(x.fOutputId()));
  }

  private _getNodeOutputIds(nodeOrGroup: FNodeBase): string[] {
    return this._store.outputs
      .getAll()
      .filter((x) => nodeOrGroup.isContains(x.hostElement))
      .map((x) => x.fId());
  }

  private _createAndSetConnectionToNodeHandler(
    connection: FConnectionBase,
    request: AttachSourceConnectionDragHandlersToNodeRequest,
  ): void {
    let connectionHandler = this._getExistingConnectionHandler(request.handlerPool, connection);
    if (!connectionHandler) {
      connectionHandler = this._createConnectionHandler(request.targetIds, connection);
      request.handlerPool.push(connectionHandler);
    }
    request.dragHandler.sourceConnectionHandlers.push(connectionHandler);
  }

  private _getExistingConnectionHandler(
    existingConnectionHandlers: DragNodeConnectionHandlerBase[],
    connection: FConnectionBase,
  ): DragNodeConnectionHandlerBase | undefined {
    return existingConnectionHandlers.find((x) => x.connection.fId() === connection.fId());
  }

  private _createConnectionHandler(
    inputIds: string[],
    connection: FConnectionBase,
  ): DragNodeConnectionHandlerBase {
    let result: DragNodeConnectionHandlerBase;
    if (inputIds.includes(connection.fInputId())) {
      result = this._dragInjector.createInstance(DragNodeConnectionBothSidesHandler);
    } else {
      result = this._dragInjector.createInstance(DragNodeConnectionSourceHandler);
    }
    result.initialize(connection);

    return result;
  }
}
