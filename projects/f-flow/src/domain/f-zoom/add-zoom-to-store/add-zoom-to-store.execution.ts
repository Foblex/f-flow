import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { AddZoomToStoreRequest } from './add-zoom-to-store-request';
import { FComponentsStore } from '../../../f-storage';
import { F_ZOOM_TAG } from '../f-zoom-tag';

@Injectable()
@FExecutionRegister(AddZoomToStoreRequest)
export class AddZoomToStoreExecution implements IExecution<AddZoomToStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: AddZoomToStoreRequest): void {
    this._fComponentsStore.fComponents = {
      [F_ZOOM_TAG]: request.fComponent
    };
  }
}
