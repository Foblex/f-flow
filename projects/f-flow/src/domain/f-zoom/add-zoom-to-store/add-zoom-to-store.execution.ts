import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddZoomToStoreRequest } from './add-zoom-to-store-request';
import { FComponentsStore } from '../../../f-storage';
import { F_ZOOM_TAG } from '../f-zoom-tag';

/**
 * Execution that adds a Zoom to the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(AddZoomToStoreRequest)
export class AddZoomToStoreExecution
  implements IExecution<AddZoomToStoreRequest, void> {

  private readonly _store = inject(FComponentsStore);

  public handle(request: AddZoomToStoreRequest): void {
    this._store.fComponents = {
      [F_ZOOM_TAG]: request.fComponent,
    };
  }
}
