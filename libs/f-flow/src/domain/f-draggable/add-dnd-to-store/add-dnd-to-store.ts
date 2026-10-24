import { inject, Injectable } from '@angular/core';
import { IExecution } from '../../../_libs/f-mediator';
import { AddDndToStoreRequest } from './add-dnd-to-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that adds a drag and drop directive to the FComponentsStore.
 */
@Injectable()
export class AddDndToStore implements IExecution<AddDndToStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle(request: AddDndToStoreRequest): void {
    this._store.fDraggable = request.fComponent;
  }
}
