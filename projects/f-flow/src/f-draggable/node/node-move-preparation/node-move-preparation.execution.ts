import { Injectable } from '@angular/core';
import { NodeMovePreparationRequest } from './node-move-preparation.request';
import { ITransformModel, Point } from '@foblex/core';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../../infrastructure';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import {
  SelectAndUpdateNodeLayerRequest,
} from '../../../domain';
import { IDraggableItem } from '../../i-draggable-item';
import { EFDraggableType } from '../../e-f-draggable-type';
import { NodeDragHandler } from '../node.drag-handler';
import { FNodeBase } from '../../../f-node';
import { CreateMoveNodesDragModelFromSelectionRequest } from '../create-move-nodes-drag-model-from-selection';

@Injectable()
@FExecutionRegister(NodeMovePreparationRequest)
export class NodeMovePreparationExecution implements IExecution<NodeMovePreparationRequest, void> {

  private get transform(): ITransformModel {
    return this.fComponentsStore.fCanvas!.transform;
  }

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.fFlow!.hostElement;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fMediator: FFlowMediator
  ) {
  }

  public handle(request: NodeMovePreparationRequest): void {
    this.selectAndUpdateNodeLayer(request.event.targetElement);

    const itemsToDrag: IDraggableItem[] = this.createDragModelFromSelection();

    this.initializeLineAlignment(this.filterNodesFromDraggableItems(itemsToDrag));

    this.fDraggableDataContext.onPointerDownScale = this.transform.scale;
    this.fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this.flowHost).div(this.transform.scale);
    this.fDraggableDataContext.draggableItems = itemsToDrag;
  }

  private selectAndUpdateNodeLayer(targetElement: HTMLElement) {
    this.fMediator.send(
      new SelectAndUpdateNodeLayerRequest(this.getNode(targetElement))
    );
  }

  private getNode(targetElement: HTMLElement): FNodeBase {
    return this.fComponentsStore.findNode(targetElement)!;
  }

  private createDragModelFromSelection(): IDraggableItem[] {
    return this.fMediator.send(new CreateMoveNodesDragModelFromSelectionRequest());
  }

  private initializeLineAlignment(nodesToDrag: FNodeBase[]): void {
    this.fDraggableDataContext.fLineAlignment?.initialize(
      this.fComponentsStore.fNodes,
      nodesToDrag
    );
  }

  private filterNodesFromDraggableItems(items: IDraggableItem[]): FNodeBase[] {
    return items.filter((x) => x.type === EFDraggableType.NODE)
      .map(x => (x as NodeDragHandler).fNode);
  }
}
