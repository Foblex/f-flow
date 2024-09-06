import { SortItemsLayerRequest } from './sort-items-layer.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../infrastructure';
import { FComponentsStore } from '../../f-storage';
import { UpdateItemLayerRequest } from '../update-item-layer';

@Injectable()
@FExecutionRegister(SortItemsLayerRequest)
export class SortItemsLayerExecution implements IExecution<SortItemsLayerRequest, void> {

  constructor(
    private fComponentsStore: FComponentsStore,
    private fMediator: FFlowMediator
  ) {
  }

  public handle(request: SortItemsLayerRequest): void {
    this.fComponentsStore.fNodes.forEach((x) => {
      this.fMediator.send<void>(
        new UpdateItemLayerRequest(x, x.hostElement.parentElement as HTMLElement)
      );
    });
  }
}
