import { Injectable } from '@angular/core';
import { CreateMoveNodesDragModelFromSelectionRequest } from './create-move-nodes-drag-model-from-selection.request';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../../infrastructure';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import {
  GetIncomingConnectionsHandler,
  GetOutgoingConnectionsHandler,
} from '../../../domain';
import { IDraggableItem } from '../../i-draggable-item';
import { EFDraggableType } from '../../e-f-draggable-type';
import { NodeDragHandler } from '../node.drag-handler';
import { FNodeBase } from '../../../f-node';
import { FConnectorBase } from '../../../f-connectors';
import { ConnectionDragHandler } from '../connection.drag-handler';
import { ConnectionSourceDragHandler } from '../connection-source.drag-handler';
import { ConnectionTargetDragHandler } from '../connection-target.drag-handler';

@Injectable()
@FExecutionRegister(CreateMoveNodesDragModelFromSelectionRequest)
export class CreateMoveNodesDragModelFromSelectionExecution
  implements IExecution<CreateMoveNodesDragModelFromSelectionRequest, IDraggableItem[]> {

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private getOutgoingConnectionsHandler: GetOutgoingConnectionsHandler,
    private getIncomingConnectionsHandler: GetIncomingConnectionsHandler,
    private fMediator: FFlowMediator
  ) {
  }

  public handle(request: CreateMoveNodesDragModelFromSelectionRequest): IDraggableItem[] {
    const selectedNodes = this.getSelectedNodes();

    return this.getDragHandlersWithConnections(
      this.getDragHandlersFromNodes(selectedNodes),
      this.getAllOutputIds(selectedNodes),
      this.getAllInputIds(selectedNodes)
    );
  }

  private getSelectedNodes(): FNodeBase[] {
    return this.fDraggableDataContext.selectedItems.map((x) => {
      return this.fComponentsStore.findNode(x.hostElement);
    }).filter((x) => !!x) as FNodeBase[];
  }

  private getAllOutputIds(nodes: FNodeBase[]): string[] {
    return nodes.reduce((result: FConnectorBase[], x: FNodeBase) => {
      return result.concat(this.getOutputsForNode(x));
    }, []).map((x) => x.id);
  }

  private getOutputsForNode(node: FNodeBase): FConnectorBase[] {
    return this.fComponentsStore.fOutputs.filter((x) => node.isContains(x.hostElement));
  }

  private getAllInputIds(nodes: FNodeBase[]): string[] {
    return nodes.reduce((result: FConnectorBase[], x: FNodeBase) => {
      return result.concat(this.getInputsForNode(x));
    }, []).map((x) => x.id);
  }

  private getInputsForNode(node: FNodeBase): FConnectorBase[] {
    return this.fComponentsStore.fInputs.filter((x) => node.isContains(x.hostElement));
  }

  private getDragHandlersFromNodes(nodes: FNodeBase[]): NodeDragHandler[] {
    return nodes.map((x) => new NodeDragHandler(this.fDraggableDataContext, x));
  }

  private getDragHandlersWithConnections(
    nodes: NodeDragHandler[], outputIds: string[], inputIds: string[]
  ): IDraggableItem[] {
    let result: IDraggableItem[] = nodes;
    nodes.forEach((nodeHandler) => {
      this.getDragHandlersForOutputConnections(nodeHandler.fNode, inputIds, result);
      this.getDragHandlersForInputConnections(nodeHandler.fNode, outputIds, result);
    });
    return result;
  }

  private getDragHandlersForOutputConnections(fNode: FNodeBase, inputIds: string[], result: IDraggableItem[]): void {
    this.getOutgoingConnectionsHandler.handle(this.getOutputsForNode(fNode)).forEach((c) => {
      if (inputIds.includes(c.fInputId)) {
        result.push(
          new ConnectionDragHandler(this.fMediator, c)
        );
      } else {
        result.push(
          new ConnectionSourceDragHandler(this.fMediator, c)
        );
      }
    });
  }

  private getDragHandlersForInputConnections(fNode: FNodeBase, outputIds: string[], result: IDraggableItem[]): void {
    this.getIncomingConnectionsHandler.handle(this.getInputsForNode(fNode)).forEach((c) => {
      if (outputIds.includes(c.fOutputId)) {
        const index = result.findIndex((x) => x.type === EFDraggableType.CONNECTION && (x as ConnectionDragHandler).connection.fConnectionId === c.fConnectionId);
        if (index !== -1) {
          result.push(
            new ConnectionDragHandler(this.fMediator, c)
          );
        }
      } else {
        result.push(
          new ConnectionTargetDragHandler(this.fMediator, c)
        );
      }
    });
  }
}
