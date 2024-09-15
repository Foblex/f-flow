import { SortItemLayersRequest } from './sort-item-layers.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { SortNodeLayersRequest } from './sort-node-layers-by-groups';
import { SortItemsByParentRequest } from './sort-items-by-parent';
import { FComponentsStore } from '../../f-storage';

@Injectable()
@FExecutionRegister(SortItemLayersRequest)
export class SortItemLayersExecution implements IExecution<SortItemLayersRequest, void> {

  constructor(
    private fMediator: FMediator,
    private fComponentsStore: FComponentsStore,
  ) {
  }

  public handle(request: SortItemLayersRequest): void {
    this.fMediator.send(new SortItemsByParentRequest(this.fComponentsStore.fCanvas!.fGroupsContainer.nativeElement));
    this.fMediator.send(new SortNodeLayersRequest());
    this.fMediator.send(new SortItemsByParentRequest(this.fComponentsStore.fCanvas!.fNodesContainer.nativeElement));
  }
}
