import { inject, Injectable } from '@angular/core';
import { IExecution } from '../../../_libs/f-mediator';
import { RemoveDndFromStoreRequest } from './remove-dnd-from-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes the drag and drop directive from the FComponentsStore.
 */
@Injectable()
export class RemoveDndFromStore implements IExecution<RemoveDndFromStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle(_: RemoveDndFromStoreRequest): void {
    this._store.fDraggable = undefined;
  }
}
