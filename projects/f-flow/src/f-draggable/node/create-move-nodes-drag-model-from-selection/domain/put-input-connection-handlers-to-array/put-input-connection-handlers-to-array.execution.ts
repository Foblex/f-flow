import { Injectable } from '@angular/core';
import { PutInputConnectionHandlersToArrayRequest } from './put-input-connection-handlers-to-array.request';
import { FComponentsStore } from '../../../../../f-storage';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../../../f-node';
import { NodeDragHandler } from '../../../node.drag-handler';
import { IDraggableItem } from '../../../../i-draggable-item';
import { ConnectionDragHandler } from '../../../connection.drag-handler';
import { FConnectorBase } from '../../../../../f-connectors';
import { FConnectionBase } from '../../../../../f-connection';
import { ConnectionTargetDragHandler } from '../../../connection-target.drag-handler';

@Injectable()
@FExecutionRegister(PutInputConnectionHandlersToArrayRequest)
export class PutInputConnectionHandlersToArrayExecution
  implements IExecution<PutInputConnectionHandlersToArrayRequest, void> {

  private get fConnections(): FConnectionBase[] {
    return this.fComponentsStore.fConnections;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FMediator
  ) {
  }

  public handle(request: PutInputConnectionHandlersToArrayRequest): void {
    this.getInputConnections(request.nodeDragHandler.fNode).forEach((connection) => {
      const index = this.getExistingConnectionHandlerIndex(request.result, connection);
      if (index !== -1) {
        this.updateExistingConnectionHandler(request.result, index, request.nodeDragHandler);
      } else {
        request.result.push(this.createNewConnectionHandler(request.nodeDragHandler, request.outputIds, connection));
      }
    });
  }

  public getInputConnections(node: FNodeBase): FConnectionBase[] {
    const inputIds = new Set(this.getInputsForNode(node).map((x) => x.fId));
    return this.fConnections.filter((x) => inputIds.has(x.fInputId));
  }

  private getInputsForNode(node: FNodeBase): FConnectorBase[] {
    return this.fComponentsStore.fInputs.filter((x) => node.isContains(x.hostElement));
  }

  private getExistingConnectionHandlerIndex(result: IDraggableItem[], connection: FConnectionBase): number {
    return result.findIndex(
      (x) => x instanceof ConnectionDragHandler && x.connection.fId === connection.fId
    );
  }

  private createNewConnectionHandler(nodeDragHandler: NodeDragHandler, outputIds: string[], connection: FConnectionBase): IDraggableItem {
    let result: IDraggableItem;
    if (outputIds.includes(connection.fOutputId)) {
      result = this.getNewConnectionHandler(connection, nodeDragHandler);
    } else {
      result = this.getNewSourceConnectionHandler(connection, nodeDragHandler);
    }
    return result;
  }

  private getNewConnectionHandler(connection: FConnectionBase, nodeDragHandler: NodeDragHandler): ConnectionDragHandler {
    const handler = new ConnectionDragHandler(this.fMediator, this.fComponentsStore, connection);
    handler.setInputRestrictions(nodeDragHandler.minDistance, nodeDragHandler.maxDistance);
    return handler;
  }

  private updateExistingConnectionHandler(result: IDraggableItem[], index: number, nodeDragHandler: NodeDragHandler): void {
    (result[ index ] as ConnectionDragHandler).setInputRestrictions(nodeDragHandler.minDistance, nodeDragHandler.maxDistance);
  }

  private getNewSourceConnectionHandler(connection: FConnectionBase, nodeDragHandler: NodeDragHandler): ConnectionTargetDragHandler {
    return new ConnectionTargetDragHandler(this.fMediator, this.fComponentsStore, connection, nodeDragHandler.minDistance, nodeDragHandler.maxDistance);
  }
}

