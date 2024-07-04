import { Injectable } from '@angular/core';
import { NodeResizePreparationRequest } from './node-resize-preparation.request';
import { ITransformModel, Point } from '@foblex/core';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../../infrastructure';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import {
  getValueFromDataAttr,
  SelectAndUpdateNodeLayerRequest,
} from '../../../domain';
import { IDraggableItem } from '../../i-draggable-item';
import { EFResizeHandleType, FNodeBase } from '../../../f-node';
import { NodeResizeDragHandler } from '../node-resize.drag-handler';

@Injectable()
@FExecutionRegister(NodeResizePreparationRequest)
export class NodeResizePreparationExecution implements IExecution<NodeResizePreparationRequest, void> {

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

  public handle(request: NodeResizePreparationRequest): void {
    this.selectAndUpdateNodeLayer(request.event.targetElement);

    const handleType = getValueFromDataAttr(request.event.targetElement, 'fResizeHandleType', '.f-resize-handle');
    const itemsToDrag: IDraggableItem[] = [
      new NodeResizeDragHandler(
        this.fComponentsStore,
        this.getNode(request.event.targetElement),
        EFResizeHandleType[ handleType as keyof typeof EFResizeHandleType ]
      )
    ];

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
}
