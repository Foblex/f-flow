import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveCanvasFromStoreRequest } from './remove-canvas-from-store-request';
import { FComponentsStore } from '../../../f-storage';

@Injectable()
@FExecutionRegister(RemoveCanvasFromStoreRequest)
export class RemoveCanvasFromStoreExecution implements IExecution<RemoveCanvasFromStoreRequest, void> {

  private _fComponentsStore = inject(FComponentsStore);

  public handle(request: RemoveCanvasFromStoreRequest): void {
    this._fComponentsStore.fCanvas = undefined;
  }
}
