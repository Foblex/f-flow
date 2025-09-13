import { inject, Injectable, Injector } from '@angular/core';
import { CreateInputConnectionHandlerAndSetToNodeHandlerRequest } from './create-input-connection-handler-and-set-to-node-handler-request';
import { FComponentsStore } from '../../../../f-storage';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../../f-node';
import { FConnectionBase } from '../../../../f-connection';
import {
  BaseConnectionDragHandler,
  SourceTargetConnectionDragHandler,
  TargetConnectionDragHandler,
} from '../../connection-drag-handlers';

@Injectable()
@FExecutionRegister(CreateInputConnectionHandlerAndSetToNodeHandlerRequest)
export class CreateInputConnectionHandlerAndSetToNodeHandler
  implements IExecution<CreateInputConnectionHandlerAndSetToNodeHandlerRequest, void>
{
  private readonly _store = inject(FComponentsStore);
  private readonly _injector = inject(Injector);

  private get _connections(): FConnectionBase[] {
    return this._store.fConnections;
  }

  public handle(request: CreateInputConnectionHandlerAndSetToNodeHandlerRequest): void {
    this._getInputConnections(request.dragHandler.nodeOrGroup).forEach((connection) => {
      this._createAndSetConnectionToNodeHandler(connection, request);
    });
  }

  private _getInputConnections(nodeOrGroup: FNodeBase): FConnectionBase[] {
    const ids = new Set(this._getNodeInputIds(nodeOrGroup));

    return this._connections.filter((x) => ids.has(x.fInputId()));
  }

  private _getNodeInputIds(nodeOrGroup: FNodeBase): string[] {
    return this._store.fInputs
      .filter((x) => nodeOrGroup.isContains(x.hostElement))
      .map((x) => x.fId());
  }

  private _createAndSetConnectionToNodeHandler(
    connection: FConnectionBase,
    request: CreateInputConnectionHandlerAndSetToNodeHandlerRequest,
  ): void {
    let connectionHandler = this._getExistingConnectionHandler(
      request.existingConnectionHandlers,
      connection,
    );
    if (!connectionHandler) {
      connectionHandler = this._createConnectionHandler(request.outputIds, connection);
      request.existingConnectionHandlers.push(connectionHandler);
    }
    request.dragHandler.fTargetHandlers.push(connectionHandler);
  }

  private _getExistingConnectionHandler(
    existingConnectionHandlers: BaseConnectionDragHandler[],
    connection: FConnectionBase,
  ): BaseConnectionDragHandler | undefined {
    return existingConnectionHandlers.find((x) => x.fConnection.fId() === connection.fId());
  }

  private _createConnectionHandler(
    outputIds: string[],
    connection: FConnectionBase,
  ): BaseConnectionDragHandler {
    let result: BaseConnectionDragHandler | undefined;
    if (outputIds.includes(connection.fOutputId())) {
      result = new SourceTargetConnectionDragHandler(this._injector, connection);
    } else {
      result = new TargetConnectionDragHandler(this._injector, connection);
    }

    return result;
  }
}
