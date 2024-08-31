import { UpdateItemLayerRequest } from './update-item-layer.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '../../infrastructure';

@Injectable()
@FExecutionRegister(UpdateItemLayerRequest)
export class UpdateItemLayerExecution implements IExecution<UpdateItemLayerRequest, void> {

  public handle(request: UpdateItemLayerRequest): void {

    const elements = Array.from(request.itemContainer.children);
    const index = this.getTargetIndex(elements, request.item.hostElement);

    if (this.isNotLastElement(elements, index)) {
      elements.splice(index + 1).forEach((x) => {
        request.itemContainer.removeChild(x);
        request.itemContainer.insertBefore(x, request.item.hostElement);
      });
    }
  }

  private getTargetIndex(elements: Element[], item: Element): number {
    return elements.findIndex((x) => x === item);
  }

  private isNotLastElement(elements: Element[], index: number): boolean {
    return index !== -1 && index !== elements.length - 1;
  }
}
