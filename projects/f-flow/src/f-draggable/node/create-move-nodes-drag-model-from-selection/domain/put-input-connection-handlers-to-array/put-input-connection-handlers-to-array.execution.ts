import { inject, Injectable } from '@angular/core';
import { PutInputConnectionHandlersToArrayRequest } from './put-input-connection-handlers-to-array.request';
import { FComponentsStore } from '../../../../../f-storage';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../../../f-node';
import { FConnectionBase } from '../../../../../f-connection';
import { BaseConnectionDragHandler } from '../../../connection-drag-handlers/base-connection.drag-handler';
import { SourceTargetConnectionDragHandler } from '../../../connection-drag-handlers/source-target-connection.drag-handler';
import { TargetConnectionDragHandler } from '../../../connection-drag-handlers/target-connection.drag-handler';

@Injectable()
@FExecutionRegister(PutInputConnectionHandlersToArrayRequest)
export class PutInputConnectionHandlersToArrayExecution
  implements IExecution<PutInputConnectionHandlersToArrayRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  private get _fConnections(): FConnectionBase[] {
    return this._fComponentsStore.fConnections;
  }

  public handle(request: PutInputConnectionHandlersToArrayRequest): void {
    this._getInputConnections(request.fDragHandler.fNode).forEach((fConnection) => {
      this._createAndSetConnectionToNodeHandler(fConnection, request);
    });
  }

  private _getInputConnections(fNode: FNodeBase): FConnectionBase[] {
    const ids = new Set(this._getNodeInputIds(fNode));
    return this._fConnections.filter((x) => ids.has(x.fInputId));
  }

  private _getNodeInputIds(fNode: FNodeBase): string[] {
    return this._fComponentsStore.fInputs
      .filter((x) => fNode.isContains(x.hostElement))
      .map((x) => x.fId);
  }

  private _createAndSetConnectionToNodeHandler(fConnection: FConnectionBase, request: PutInputConnectionHandlersToArrayRequest): void {
    let fHandler = this._getExistingConnectionHandler(request.result, fConnection);
    if (!fHandler) {
      fHandler = this._createConnectionHandler(request.outputIds, fConnection);
      request.result.push(fHandler);
    }
    request.fDragHandler.fTargetHandlers.push(fHandler);
  }

  private _getExistingConnectionHandler(fHandlers: BaseConnectionDragHandler[], fConnection: FConnectionBase): BaseConnectionDragHandler | undefined {
    return fHandlers.find((x) => x.fConnection.fId === fConnection.fId);
  }

  private _createConnectionHandler(outputIds: string[], fConnection: FConnectionBase): BaseConnectionDragHandler {
    let result: BaseConnectionDragHandler | undefined;
    if (outputIds.includes(fConnection.fOutputId)) {
      result = new SourceTargetConnectionDragHandler(fConnection);
    } else {
      result = new TargetConnectionDragHandler(fConnection);
    }
    return result;
  }
}

