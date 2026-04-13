import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { RemoveCanvasFromStoreRequest } from './remove-canvas-from-store-request';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that removes the canvas from the FComponentsStore.
 */
@Injectable()
@FExecutionRegister(RemoveCanvasFromStoreRequest)
export class RemoveCanvasFromStore implements IExecution<RemoveCanvasFromStoreRequest, void> {
  private readonly _store = inject(FComponentsStore);

  public handle(_: RemoveCanvasFromStoreRequest): void {
    this._store.fCanvas = undefined;
  }
}
