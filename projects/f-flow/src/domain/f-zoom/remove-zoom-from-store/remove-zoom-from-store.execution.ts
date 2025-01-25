import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveZoomFromStoreRequest } from './remove-zoom-from-store-request';
import { FComponentsStore } from '../../../f-storage';
import { F_ZOOM_TAG } from '../f-zoom-tag';

@Injectable()
@FExecutionRegister(RemoveZoomFromStoreRequest)
export class RemoveZoomFromStoreExecution implements IExecution<RemoveZoomFromStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: RemoveZoomFromStoreRequest): void {
    this._fComponentsStore.fComponents = {
      [F_ZOOM_TAG]: undefined
    };
  }
}
