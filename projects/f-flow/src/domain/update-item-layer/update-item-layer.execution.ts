import { UpdateItemLayerRequest } from './update-item-layer.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '../../infrastructure';
import { ISelectable } from '../../f-connection';
import { FComponentsStore } from '../../f-storage';

@Injectable()
@FExecutionRegister(UpdateItemLayerRequest)
export class UpdateItemLayerExecution implements IExecution<UpdateItemLayerRequest, void> {

  constructor(
    private fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(request: UpdateItemLayerRequest): void {
    const elements = Array.from(request.itemContainer.children);
    const index = this.getTargetIndex(elements, request.item.hostElement);

    const elementsThatShouldBeInFront = this.getElementsThatShouldBeInFront(request.item);

    if (this.isNotLastElement(elements, index)) {
      const elementsToMove: Element[] = [];
      for (let i = index + 1; i < elements.length; i++) {
        const element = elements[i];
        if (!elementsThatShouldBeInFront.includes(element)) {
          elementsToMove.push(element);
        }
      }
      elementsToMove.forEach((x) => {
        request.itemContainer.removeChild(x);
        request.itemContainer.insertBefore(x, request.item.hostElement);
      });
    }
  }

  private getElementsThatShouldBeInFront(item: ISelectable): Element[] {
    return this.fComponentsStore.fNodes.filter((x) => x.fParentId === item.fId).map((x) => x.hostElement);
  }

  private getTargetIndex(elements: Element[], item: Element): number {
    return elements.findIndex((x) => x === item);
  }

  private isNotLastElement(elements: Element[], index: number): boolean {
    return index !== -1 && index !== elements.length - 1;
  }
}
