import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveZoomFromStoreRequest } from './remove-zoom-from-store-request';
import { FComponentsStore } from '../../../f-storage';
import { F_ZOOM_TAG } from '../f-zoom-tag';

/**
 * Execution that removes a Zoom from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveZoomFromStoreRequest)
export class RemoveZoomFromStoreExecution implements IExecution<RemoveZoomFromStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle(_request: RemoveZoomFromStoreRequest): void {
    this._store.fComponents = {
      [F_ZOOM_TAG]: undefined,
    };
  }
}
