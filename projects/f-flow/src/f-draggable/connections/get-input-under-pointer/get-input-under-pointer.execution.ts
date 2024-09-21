import { IPoint, Point } from '@foblex/2d';
import { GetInputUnderPointerRequest } from './get-input-under-pointer.request';
import { Injectable } from '@angular/core';
import { BrowserService } from '@foblex/platform';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FConnectorBase } from '../../../f-connectors';
import { FNodeBase } from '../../../f-node';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { CreateConnectionDragHandler } from '../create-connection';
import { ReassignConnectionDragHandler } from '../reassign-connection';


@Injectable()
@FExecutionRegister(GetInputUnderPointerRequest)
export class GetInputUnderPointerExecution
  implements IExecution<GetInputUnderPointerRequest, FConnectorBase | undefined> {

  private get fNodes(): FNodeBase[] {
    return this.fComponentsStore.fNodes;
  }

  private get fInputs(): FConnectorBase[] {
    return this.fComponentsStore.fInputs;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fBrowser: BrowserService
  ) {
  }

  public handle(payload: GetInputUnderPointerRequest): FConnectorBase | undefined {
    const output = (this.getOutput(payload.dragHandler) || this.getOutlet(payload.dragHandler))!;
    const inputsUnderPointer = this.getInputsUnderPointer(payload.event.getPosition(), payload.dragHandler);

    const connectors = output.isSelfConnectable ?
      inputsUnderPointer :
      this.filterSelfConnectable(inputsUnderPointer, output)
    return connectors.length > 0 ? connectors[0] : undefined;
  }

  private getOutput(dragHandler: CreateConnectionDragHandler | ReassignConnectionDragHandler): FConnectorBase | undefined {
    return this.fComponentsStore.fOutputs.find((x) => x.id === dragHandler.fConnection.fOutputId);
  }

  private getOutlet(dragHandler: CreateConnectionDragHandler | ReassignConnectionDragHandler): FConnectorBase | undefined {
    return this.fComponentsStore.fOutlets.find((x) => x.id === dragHandler.fConnection.fOutputId);
  }

  private getInputsUnderPointer(position: IPoint, dragHandler: CreateConnectionDragHandler | ReassignConnectionDragHandler): FConnectorBase[] {
    const result = this.getInputsInPosition(position);
    const closestInput = dragHandler.getClosetInput(this.getDifference(position));
    if (closestInput) {
      result.push(closestInput.fConnector);
    }
    const input = this.getFirstConnectableInputOfNodeInPosition(position);
    if (input) {
      result.push(input);
    }
    return result;
  }

  private getDifference(position: IPoint): IPoint {
    return Point.fromPoint(position).elementTransform(this.fComponentsStore.flowHost)
      .div(this.fDraggableDataContext.onPointerDownScale).sub(this.fDraggableDataContext.onPointerDownPosition);
  }

  private getInputsInPosition(position: IPoint): FConnectorBase[] {
    return this.getElementsFromPoint(position).map((element) =>
      this.fInputs.find(x => x.isContains(element) && x.canBeConnected)
    ).filter((x) => !!x) as FConnectorBase[];
  }

  private getElementsFromPoint(position: IPoint): HTMLElement[] {
    return this.fBrowser.document.elementsFromPoint(position.x, position.y) as HTMLElement[];
  }

  private getFirstConnectableInputOfNodeInPosition(position: IPoint): FConnectorBase | undefined {
    return this.getNodesInPosition(position).map((x) => {
      return this.fInputs.find((i) => x.isContains(i.hostElement) && i.canBeConnected);
    }).find((x) => !!x);
  }

  private getNodesInPosition(position: IPoint): FNodeBase[] {
    return this.getElementsFromPoint(position).map((element) => {
      return this.fNodes.find((x) => x.isContains(element) && x.fConnectOnNode)
    }).filter((x) => !!x) as FNodeBase[];
  }

  private filterSelfConnectable(inputs: FConnectorBase[], connector: FConnectorBase): FConnectorBase[] {
    return inputs.filter((x) => {
      const targetNode = this.fNodes.find((k) => k.isContains(x.hostElement));
      const sourceNode = this.fNodes.find((k) => k.isContains(connector!.hostElement));
      return sourceNode?.hostElement !== targetNode?.hostElement;
    })
  }
}
