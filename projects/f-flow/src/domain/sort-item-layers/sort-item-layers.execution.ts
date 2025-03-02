import { SortItemLayersRequest } from './sort-item-layers.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { SortNodeLayersRequest } from './sort-node-layers-by-groups';
import { SortItemsByParentRequest } from './sort-items-by-parent';
import { FComponentsStore } from '../../f-storage';
import { FCanvasBase } from '../../f-canvas';

@Injectable()
@FExecutionRegister(SortItemLayersRequest)
export class SortItemLayersExecution implements IExecution<SortItemLayersRequest, void> {

  private readonly _fMediator = inject(FMediator);
  private readonly _fComponentsStore = inject(FComponentsStore);

  private get _fCanvas(): FCanvasBase {
    return this._fComponentsStore.fCanvas!;
  }

  public handle(request: SortItemLayersRequest): void {
    if(!this._fComponentsStore.fCanvas) {
      return;
    }
    this._fMediator.execute(new SortItemsByParentRequest(this._fCanvas.fGroupsContainer().nativeElement));
    this._fMediator.execute(new SortNodeLayersRequest());
    this._fMediator.execute(new SortItemsByParentRequest(this._fCanvas.fNodesContainer().nativeElement));
  }
}
