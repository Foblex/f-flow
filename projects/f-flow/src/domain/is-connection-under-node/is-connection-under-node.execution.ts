import { IRect, ITransformModel, RectExtensions } from '@foblex/core';
import { Injectable } from '@angular/core';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../infrastructure';
import { IsConnectionUnderNodeRequest } from './is-connection-under-node.request';
import { FComponentsStore } from '../../f-storage';
import { EFDraggableType, FDraggableDataContext, NodeDragHandler } from '../../f-draggable';
import { GetOutgoingConnectionsHandler } from '../get-outgoing-connections.handler';
import { GetIncomingConnectionsHandler } from '../get-incoming-connections.handler';
import { FNodeBase } from '../../f-node';
import { FConnectorBase } from '../../f-connectors';
import { FConnectionBase } from '../../f-connection';
import { GetElementRectInFlowRequest } from '../get-element-rect-in-flow';

@Injectable()
@FExecutionRegister(IsConnectionUnderNodeRequest)
export class IsConnectionUnderNodeExecution implements IExecution<IsConnectionUnderNodeRequest, void> {

  private get transform(): ITransformModel {
    return this.fComponentsStore.fCanvas!.transform;
  }

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.fFlow!.hostElement;
  }

  constructor(
      private fComponentsStore: FComponentsStore,
      private fDraggableDataContext: FDraggableDataContext,
      private fMediator: FFlowMediator,
      private getOutgoingConnectionsHandler: GetOutgoingConnectionsHandler,
      private getIncomingConnectionsHandler: GetIncomingConnectionsHandler
  ) {
  }

  public handle(): void {

    const isValid = this.isValidRequest();
    if (!isValid) {
      return;
    }

    const fNode = (this.fDraggableDataContext.draggableItems[ 0 ] as NodeDragHandler).fNode;

    const outputsOfNode = this.getOutputsForNode(fNode);
    const inputsOfNode = this.getInputsForNode(fNode);

    const isCantBeConnectedByOutput = outputsOfNode.some((x) => !x.canBeConnected);

    const isCantBeConnectedByInput = this.fComponentsStore.fConnections.some((x) => {
      return inputsOfNode.find((input) => input.id === x.fInputId);
    });

    if (!isCantBeConnectedByInput && outputsOfNode.length && !isCantBeConnectedByOutput && inputsOfNode.length) {
      const output = outputsOfNode[ 0 ];
      const input = inputsOfNode[ 0 ];
      const outgoingConnections = this.getOutgoingConnectionsHandler.handle([ output ]);
      const incomingConnections = this.getIncomingConnectionsHandler.handle([ input ]);
      if (outgoingConnections.length === 0 && incomingConnections.length === 0) {
        const connections = this.findConnectionsUnderNode(fNode);
        if (connections.length) {
          //TODO: need to implement
        }
      }
    }
  }

  private isValidRequest(): boolean {
    const result =
        this.fDraggableDataContext.draggableItems.length === 1 &&
        this.fDraggableDataContext.draggableItems[ 0 ].type === EFDraggableType.NODE;

    return result;
  }

  private getOutputsForNode(node: FNodeBase): FConnectorBase[] {
    return this.fComponentsStore.fOutputs.filter((x) => node.isContains(x.hostElement));
  }

  private getInputsForNode(node: FNodeBase): FConnectorBase[] {
    return this.fComponentsStore.fInputs.filter((x) => node.isContains(x.hostElement));
  }

  private findConnectionsUnderNode(node: FNodeBase): FConnectionBase[] {
    const nodeRect = this.fMediator.send<IRect>(new GetElementRectInFlowRequest(node.hostElement));
    return this.fComponentsStore.fConnections.filter((x) => {
      const intersection = RectExtensions.intersectionWithVector(nodeRect, x.vector.point1, x.vector.point2);
      return (intersection || []).length > 0
    });
  }
}
