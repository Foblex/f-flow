import { IRect, ITransformModel } from '@foblex/2d';
import { Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { IsConnectionUnderNodeRequest } from './is-connection-under-node.request';
import { FComponentsStore } from '../../f-storage';
import { FDraggableDataContext, NodeDragHandler } from '../../f-draggable';
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
      private fMediator: FMediator,
      // private getOutgoingConnectionsHandler: GetOutgoingConnectionsHandler,
      // private getIncomingConnectionsHandler: GetIncomingConnectionsHandler
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
      return inputsOfNode.find((input) => input.fId === x.fInputId);
    });

    if (!isCantBeConnectedByInput && outputsOfNode.length && !isCantBeConnectedByOutput && inputsOfNode.length) {
      const output = outputsOfNode[ 0 ];
      const input = inputsOfNode[ 0 ];
      // const outgoingConnections = this.getOutgoingConnectionsHandler.handle([ output ]);
      // const incomingConnections = this.getIncomingConnectionsHandler.handle([ input ]);
      // if (outgoingConnections.length === 0 && incomingConnections.length === 0) {
      //   const connections = this.findConnectionsUnderNode(fNode);
      //   if (connections.length) {
      //     //TODO: need to implement
      //   }
      // }
    }
  }

  private isValidRequest(): boolean {
    return this.fDraggableDataContext.draggableItems.length === 1 &&
      this.fDraggableDataContext.draggableItems[ 0 ] instanceof NodeDragHandler;
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
     // const intersection = [];// RectExtensions.intersectionWithVector(nodeRect, x.line.point1, x.line.point2, 0, 0, 0, 0);
      return ([]).length > 0
    });
  }
}
// @Injectable()
// export class GetIncomingConnectionsHandler implements IHandler<FConnectorBase[], FConnectionBase[]> {
//
//   private get fConnections(): FConnectionBase[] {
//     return this.fComponentsStore.fConnections;
//   }
//
//   constructor(
//     private fComponentsStore: FComponentsStore,
//   ) {
//   }
//
//   public handle(inputs: FConnectorBase[]): FConnectionBase[] {
//     const inputsIds = inputs.map((x) => x.id);
//     return this.fConnections.filter((x) => {
//       return inputsIds.includes(x.fInputId);
//     })!;
//   }
// }
// @Injectable()
// export class GetOutgoingConnectionsHandler implements IHandler<FConnectorBase[], FConnectionBase[]> {
//
//   private get fConnections(): FConnectionBase[] {
//     return this.fComponentsStore.fConnections;
//   }
//
//   constructor(
//     private fComponentsStore: FComponentsStore,
//   ) {
//   }
//
//   public handle(outputs: FConnectorBase[]): FConnectionBase[] {
//     const outputsIds = outputs.map((x) => x.id);
//     return this.fConnections.filter((x) => {
//       return outputsIds.includes(x.fOutputId);
//     })!;
//   }
// }
