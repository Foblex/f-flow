import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddLineAlignmentToStoreRequest } from './add-line-alignment-to-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds a line alignment to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddLineAlignmentToStoreRequest)
export class AddLineAlignmentToStoreExecution implements IExecution<AddLineAlignmentToStoreRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: AddLineAlignmentToStoreRequest): void {
    this._store.fLineAlignment = request.fComponent;
  }
}
