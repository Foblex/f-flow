import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveLineAlignmentFromStoreRequest } from './remove-line-alignment-from-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes a line alignment from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveLineAlignmentFromStoreRequest)
export class RemoveLineAlignmentFromStore
  implements IExecution<RemoveLineAlignmentFromStoreRequest, void>
{
  private readonly _store = inject(FComponentsStore);

  public handle(_request: RemoveLineAlignmentFromStoreRequest): void {
    this._store.fLineAlignment = undefined;
  }
}
