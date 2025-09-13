import { inject, Injectable, Injector } from '@angular/core';
import { CreateOutputConnectionHandlerAndSetToNodeHandlerRequest } from './create-output-connection-handler-and-set-to-node-handler-request';
import { FComponentsStore } from '../../../../f-storage';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../../f-node';
import { FConnectionBase } from '../../../../f-connection';
import {
  BaseConnectionDragHandler,
  SourceTargetConnectionDragHandler,
  SourceConnectionDragHandler,
} from '../../connection-drag-handlers';

@Injectable()
@FExecutionRegister(CreateOutputConnectionHandlerAndSetToNodeHandlerRequest)
export class CreateOutputConnectionHandlerAndSetToNodeHandler
  implements IExecution<CreateOutputConnectionHandlerAndSetToNodeHandlerRequest, void>
{
  private readonly _store = inject(FComponentsStore);
  private readonly _injector = inject(Injector);

  private get _connections(): FConnectionBase[] {
    return this._store.fConnections;
  }

  public handle(request: CreateOutputConnectionHandlerAndSetToNodeHandlerRequest): void {
    this._getOutputConnections(request.fDragHandler.nodeOrGroup).forEach((fConnection) => {
      this._createAndSetConnectionToNodeHandler(fConnection, request);
    });
  }

  public _getOutputConnections(nodeOrGroup: FNodeBase): FConnectionBase[] {
    const ids = new Set(this._getNodeOutputIds(nodeOrGroup));

    return this._connections.filter((x) => ids.has(x.fOutputId()));
  }

  private _getNodeOutputIds(nodeOrGroup: FNodeBase): string[] {
    return this._store.fOutputs
      .filter((x) => nodeOrGroup.isContains(x.hostElement))
      .map((x) => x.fId());
  }

  private _createAndSetConnectionToNodeHandler(
    connection: FConnectionBase,
    request: CreateOutputConnectionHandlerAndSetToNodeHandlerRequest,
  ): void {
    let connectionHandler = this._getExistingConnectionHandler(
      request.existingConnectionHandlers,
      connection,
    );
    if (!connectionHandler) {
      connectionHandler = this._createConnectionHandler(request.inputIds, connection);
      request.existingConnectionHandlers.push(connectionHandler);
    }
    request.fDragHandler.fSourceHandlers.push(connectionHandler);
  }

  private _getExistingConnectionHandler(
    existingConnectionHandlers: BaseConnectionDragHandler[],
    connection: FConnectionBase,
  ): BaseConnectionDragHandler | undefined {
    return existingConnectionHandlers.find((x) => x.fConnection.fId() === connection.fId());
  }

  private _createConnectionHandler(
    inputIds: string[],
    connection: FConnectionBase,
  ): BaseConnectionDragHandler {
    let result: BaseConnectionDragHandler;
    if (inputIds.includes(connection.fInputId())) {
      result = new SourceTargetConnectionDragHandler(this._injector, connection);
    } else {
      result = new SourceConnectionDragHandler(this._injector, connection);
    }

    return result;
  }
}
