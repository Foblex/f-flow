import { UpdateItemLayerRequest } from './update-item-layer.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '../../infrastructure';

@Injectable()
@FExecutionRegister(UpdateItemLayerRequest)
export class UpdateItemLayerExecution implements IExecution<UpdateItemLayerRequest, void> {

  public handle(request: UpdateItemLayerRequest): void {
    const elements = Array.from(request.itemContainer.children);
    const elementsCount = elements.length;
    const targetIndex: number = elements.findIndex((x) => x === request.item.hostElement);
    if (targetIndex !== elementsCount - 1) {
      const afterElements = elements.splice(targetIndex + 1);
      afterElements.forEach((x) => {
        request.itemContainer.removeChild(x);
        request.itemContainer.insertBefore(x, request.item.hostElement);
      });
    }
  }
}
