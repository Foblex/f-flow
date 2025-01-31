import { inject, Injectable } from '@angular/core';
import { PutOutputConnectionHandlersToArrayRequest } from './put-output-connection-handlers-to-array.request';
import { FComponentsStore } from '../../../../../f-storage';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../../../f-node';
import { FConnectionBase } from '../../../../../f-connection';
import { SourceTargetConnectionDragHandler } from '../../../connection-drag-handlers/source-target-connection.drag-handler';
import { BaseConnectionDragHandler } from '../../../connection-drag-handlers/base-connection.drag-handler';
import { SourceConnectionDragHandler } from '../../../connection-drag-handlers/source-connection.drag-handler';

@Injectable()
@FExecutionRegister(PutOutputConnectionHandlersToArrayRequest)
export class PutOutputConnectionHandlersToArrayExecution
  implements IExecution<PutOutputConnectionHandlersToArrayRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  private get _fConnections(): FConnectionBase[] {
    return this._fComponentsStore.fConnections;
  }

  public handle(request: PutOutputConnectionHandlersToArrayRequest): void {
    this._getOutputConnections(request.fDragHandler.fNode).forEach((fConnection) => {
      this._createAndSetConnectionToNodeHandler(fConnection, request);
    });
  }

  public _getOutputConnections(node: FNodeBase): FConnectionBase[] {
    const ids = new Set(this._getNodeOutputIds(node));
    return this._fConnections.filter((x) => ids.has(x.fOutputId));
  }

  private _getNodeOutputIds(node: FNodeBase): string[] {
    return this._fComponentsStore.fOutputs
      .filter((x) => node.isContains(x.hostElement))
      .map((x) => x.fId);
  }

  private _createAndSetConnectionToNodeHandler(fConnection: FConnectionBase, request: PutOutputConnectionHandlersToArrayRequest): void {
    let fHandler = this._getExistingConnectionHandler(request.result, fConnection);
    if (!fHandler) {
      fHandler = this._createConnectionHandler(request.inputIds, fConnection);
      request.result.push(fHandler);
    }
    request.fDragHandler.fSourceHandlers.push(fHandler);
  }

  private _getExistingConnectionHandler(fHandlers: BaseConnectionDragHandler[], fConnection: FConnectionBase): BaseConnectionDragHandler | undefined {
    return fHandlers.find((x) => x.fConnection.fId === fConnection.fId);
  }

  private _createConnectionHandler(inputIds: string[], fConnection: FConnectionBase): BaseConnectionDragHandler {
    let result: BaseConnectionDragHandler;
    if (inputIds.includes(fConnection.fInputId)) {
      result = new SourceTargetConnectionDragHandler(fConnection);
    } else {
      result = new SourceConnectionDragHandler(fConnection)
    }
    return result;
  }
}

