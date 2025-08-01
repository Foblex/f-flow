import { SortItemLayersRequest } from './sort-item-layers.request';
import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { SortNodeLayersRequest } from './sort-node-layers-by-groups';
import { SortItemsByParentRequest } from './sort-items-by-parent';
import { FComponentsStore } from '../../f-storage';
import { FCanvasBase } from '../../f-canvas';

/**
 * Execution that sorts item layers in the FCanvas by their parent nodes.
 * This execution is registered to handle SortItemLayersRequest and
 * ensures that items are sorted correctly within their parent nodes.
 * It first sorts items by their parent nodes in the groups container,
 * then sorts the node layers, and finally sorts items by their parent nodes in the nodes container.
 */
@Injectable()
@FExecutionRegister(SortItemLayersRequest)
export class SortItemLayersExecution implements IExecution<SortItemLayersRequest, void> {

  private readonly _store = inject(FComponentsStore);
  private readonly _mediator = inject(FMediator);

  private get _fCanvas(): FCanvasBase {
    return this._store.fCanvas!;
  }

  public handle(request: SortItemLayersRequest): void {
    if(!this._store.fCanvas) {
      return;
    }
    this._mediator.execute(new SortItemsByParentRequest(this._fCanvas.fGroupsContainer().nativeElement));
    this._mediator.execute(new SortNodeLayersRequest());
    this._mediator.execute(new SortItemsByParentRequest(this._fCanvas.fNodesContainer().nativeElement));
  }
}
