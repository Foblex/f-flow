import { Injectable } from '@angular/core';
import { NodeResizePreparationRequest } from './node-resize-preparation.request';
import { FValidatorRegister, IValidator } from '../../../infrastructure';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { isElementWithClass } from '../../../domain';
import { FNodeBase } from '../../../f-node';

@Injectable()
@FValidatorRegister(NodeResizePreparationRequest)
export class NodeResizePreparationValidator implements IValidator<NodeResizePreparationRequest> {

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: NodeResizePreparationRequest): boolean {
    return this.isDragHandlesEmpty()
      && this.isDragHandleElement(request.event.targetElement)
      && this.isNodeCanBeDragged(this.getNode(request.event.targetElement));
  }

  private isDragHandlesEmpty(): boolean {
    return !this.fDraggableDataContext.draggableItems.length;
  }

  private getNode(targetElement: HTMLElement): FNodeBase | undefined {
    return this.fComponentsStore.findNode(targetElement);
  }

  private isNodeCanBeDragged(node: FNodeBase | undefined): boolean {
    return !!node && !node.fDraggingDisabled;
  }

  private isDragHandleElement(targetElement: HTMLElement): boolean {
    return isElementWithClass(targetElement, '.f-resize-handle');
  }
}
