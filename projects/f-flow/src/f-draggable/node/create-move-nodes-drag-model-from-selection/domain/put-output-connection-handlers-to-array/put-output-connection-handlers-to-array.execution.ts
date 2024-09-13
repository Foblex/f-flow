import { Injectable } from '@angular/core';
import { PutOutputConnectionHandlersToArrayRequest } from './put-output-connection-handlers-to-array.request';
import { FComponentsStore } from '../../../../../f-storage';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../../../f-node';
import { NodeDragHandler } from '../../../node.drag-handler';
import { IDraggableItem } from '../../../../i-draggable-item';
import { ConnectionDragHandler } from '../../../connection.drag-handler';
import { ConnectionSourceDragHandler } from '../../../connection-source.drag-handler';
import { FConnectorBase } from '../../../../../f-connectors';
import { FConnectionBase } from '../../../../../f-connection';

@Injectable()
@FExecutionRegister(PutOutputConnectionHandlersToArrayRequest)
export class PutOutputConnectionHandlersToArrayExecution
  implements IExecution<PutOutputConnectionHandlersToArrayRequest, void> {

  private get fConnections(): FConnectionBase[] {
    return this.fComponentsStore.fConnections;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FMediator
  ) {
  }

  public handle(request: PutOutputConnectionHandlersToArrayRequest): void {
    this.getOutputConnections(request.nodeDragHandler.fNode).forEach((connection) => {
      const index = this.getExistingConnectionHandlerIndex(request.result, connection);
      if (index !== -1) {
        this.updateExistingConnectionHandler(request.result, index, request.nodeDragHandler);
      } else {
        request.result.push(this.createNewConnectionHandler(request.nodeDragHandler, request.inputIds, connection));
      }
    });
  }

  public getOutputConnections(node: FNodeBase): FConnectionBase[] {
    const outputsIds = new Set(this.getOutputsForNode(node).map((x) => x.id));
    return this.fConnections.filter((x) => outputsIds.has(x.fOutputId));
  }

  private getOutputsForNode(node: FNodeBase): FConnectorBase[] {
    return this.fComponentsStore.fOutputs.filter((x) => node.isContains(x.hostElement));
  }

  private getExistingConnectionHandlerIndex(result: IDraggableItem[], connection: FConnectionBase): number {
    return result.findIndex(
      (x) => x instanceof ConnectionDragHandler && x.connection.fId === connection.fId
    );
  }

  private createNewConnectionHandler(nodeDragHandler: NodeDragHandler, inputIds: string[], connection: FConnectionBase): IDraggableItem {
    let result: IDraggableItem;
    if (inputIds.includes(connection.fInputId)) {
      result = this.getNewConnectionHandler(connection, nodeDragHandler);
    } else {
      result = this.getNewSourceConnectionHandler(connection, nodeDragHandler);
    }
    return result;
  }

  private getNewConnectionHandler(connection: FConnectionBase, nodeDragHandler: NodeDragHandler): ConnectionDragHandler {
    const handler = new ConnectionDragHandler(this.fMediator, connection);
    handler.setOutputRestrictions(nodeDragHandler.minDistance, nodeDragHandler.maxDistance);
    return handler;
  }

  private updateExistingConnectionHandler(result: IDraggableItem[], index: number, nodeDragHandler: NodeDragHandler): void {
    (result[ index ] as ConnectionDragHandler).setOutputRestrictions(nodeDragHandler.minDistance, nodeDragHandler.maxDistance);
  }

  private getNewSourceConnectionHandler(connection: FConnectionBase, nodeDragHandler: NodeDragHandler): ConnectionSourceDragHandler {
    return new ConnectionSourceDragHandler(this.fMediator, connection, nodeDragHandler.minDistance, nodeDragHandler.maxDistance);
  }
}

